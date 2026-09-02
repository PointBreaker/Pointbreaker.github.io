#!/usr/bin/env python3
import argparse
import json
import re
import subprocess
from pathlib import Path


BANNED_DEPENDENCIES = (
    "see the textbook",
    "refer to the textbook",
    "full problem statement not provided",
    "please consult the textbook",
    "请参见教材",
    "见教材原题",
    "打开外部链接",
    "参考外部图",
)

VALID_PRESENTATION_TYPES = (
    "官方题面翻译",
    "依据本地资料重建",
    "站内等价练习",
    "Handout 完整本土化",
)

BARE_REFERENCE_PATTERNS = (
    re.compile(r"(?:练习|习题)[：:][^。；\n]{0,220}\b\d+[A-Z]-\d", re.I),
    re.compile(r"(?:Simmons|Thomas|Stewart)\s+\d+(?:\.\d+)?\s*[/／]\s*\d+", re.I),
)

RAW_MATH_PATTERNS = (
    re.compile(r"\blim_\{?", re.I),
    re.compile(r"\bsqrt\s*\(", re.I),
    re.compile(r"(?:^|\s)[A-Za-z][A-Za-z0-9_]*\([^\n)]*\)\s*=", re.I),
    re.compile(r"[A-Za-z0-9)]\s*->\s*[A-Za-z0-9(+\-]", re.I),
)


def text_content(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", value)).strip()


def extract_outline(html: str) -> str:
    if "COMPLETE_SOURCE_OUTLINE_START" not in html or "COMPLETE_SOURCE_OUTLINE_END" not in html:
        return ""
    return html.split("<!-- COMPLETE_SOURCE_OUTLINE_START -->", 1)[1].split(
        "<!-- COMPLETE_SOURCE_OUTLINE_END -->", 1
    )[0]


def extract_problem_ids(outline: str) -> list[str]:
    return [
        text_content(value)
        for value in re.findall(
            r'<(?:span|code)\b[^>]*class=["\'][^"\']*\bproblem-number\b[^"\']*["\'][^>]*>([\s\S]*?)</(?:span|code)>',
            outline,
            re.I,
        )
    ]


def read_git_page(repo: Path, baseline_ref: str, page: Path) -> str | None:
    relative = page.relative_to(repo).as_posix()
    result = subprocess.run(
        ["git", "show", f"{baseline_ref}:{relative}"],
        cwd=repo,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        return None
    return result.stdout


def validate_page(path: Path, baseline_html: str | None = None) -> tuple[list[str], dict]:
    html = path.read_text(encoding="utf-8")
    baseline_ids = extract_problem_ids(extract_outline(baseline_html or ""))
    if "COMPLETE_SOURCE_OUTLINE_START" not in html:
        return [], {"rows": 0, "problemIds": [], "baselineIds": baseline_ids}

    errors = []
    if html.count("<!-- COMPLETE_SOURCE_OUTLINE_START -->") != 1 or html.count("<!-- COMPLETE_SOURCE_OUTLINE_END -->") != 1:
        errors.append("complete source outline markers must appear exactly once")
    before = html.split("<!-- COMPLETE_SOURCE_OUTLINE_START -->", 1)[0]
    outline = extract_outline(html)
    rows = len(re.findall(r'class="problem-row"', outline))
    offline = len(re.findall(r'class="offline-ready"', outline))
    problem_ids = extract_problem_ids(outline)

    if not re.search(r'<html[^>]+lang="zh(?:-CN)?"', html, re.I):
        errors.append("page language is not zh/zh-CN")
    if rows == 0:
        errors.append("generated outline has no problem rows")
    if len(problem_ids) != rows:
        errors.append(f"problem IDs {len(problem_ids)} do not match problem rows {rows}")
    duplicate_ids = sorted({value for value in problem_ids if problem_ids.count(value) > 1})
    if duplicate_ids:
        errors.append("duplicate problem IDs: " + ", ".join(duplicate_ids))
    if offline != rows:
        errors.append(f"offline markers {offline} do not match problem rows {rows}")
    if "assignment-guide" not in before and "<h2" not in before:
        errors.append("guide content is missing before the generated outline")
    if re.search(r'<a\s+[^>]*href=["\']https?://', outline, re.I):
        errors.append("problem outline contains an external link")
    if (
        re.search(r"\\[\(\[]", outline)
        and "assets/course/math-render.js" not in html
        and "assets/math-render.js" not in html
    ):
        errors.append("page contains KaTeX delimiters but does not load math-render.js")

    lowered = text_content(outline).lower()
    for phrase in BANNED_DEPENDENCIES:
        if phrase.lower() in lowered:
            errors.append(f"external dependency phrase remains: {phrase}")

    row_blocks = re.findall(r'<details\s+class="problem-row"[^>]*>([\s\S]*?)</details>', outline, re.I)
    summaries = [re.search(r"<summary>([\s\S]*?)</summary>", row, re.I) for row in row_blocks]
    for index, (row, summary_match) in enumerate(zip(row_blocks, summaries), 1):
        summary = summary_match.group(1) if summary_match else ""
        title_match = re.search(r"<strong>([\s\S]*?)</strong>", summary, re.I)
        title = text_content(title_match.group(1)) if title_match else ""
        if not re.search(r"[\u3400-\u9fff]", title):
            errors.append(f"problem {index} title is not localized: {title or 'missing'}")

        if not any(kind in row for kind in VALID_PRESENTATION_TYPES):
            errors.append(f"problem {index} has no valid presentation type")

        student_body = re.sub(
            r'<p\s+class="problem-(?:source-note|source)"[^>]*>[\s\S]*?</p>',
            " ",
            row,
            flags=re.I,
        )
        student_text = text_content(student_body)
        raw_math_candidate = re.sub(r"\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]", " ", student_body)
        raw_math_candidate = re.sub(
            r"<(?:pre|code)\b[^>]*>[\s\S]*?</(?:pre|code)>",
            " ",
            raw_math_candidate,
            flags=re.I,
        )
        for pattern in BARE_REFERENCE_PATTERNS:
            if pattern.search(student_text):
                errors.append(f"problem {index} still contains a bare exercise reference")
                break
        for pattern in RAW_MATH_PATTERNS:
            if pattern.search(raw_math_candidate):
                errors.append(f"problem {index} contains raw math without KaTeX delimiters")
                break
        if re.search(r"水平(?:的)?\s*(?:y\s*轴|纵轴)|(?:y\s*轴|纵轴)\s*(?:是|为)?\s*水平", student_text, re.I):
            errors.append(f"problem {index} contradicts horizontal direction and the y-axis")
        if re.search(r"竖直(?:的)?\s*(?:x\s*轴|横轴)|(?:x\s*轴|横轴)\s*(?:是|为)?\s*竖直", student_text, re.I):
            errors.append(f"problem {index} contradicts vertical direction and the x-axis")

    if baseline_ids:
        missing_ids = [value for value in baseline_ids if value not in problem_ids]
        if missing_ids:
            errors.append("localized problem IDs disappeared since baseline: " + ", ".join(missing_ids))

    return errors, {"rows": rows, "problemIds": problem_ids, "baselineIds": baseline_ids}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", required=True)
    parser.add_argument("--slug", required=True)
    parser.add_argument(
        "--baseline-ref",
        help="optional Git ref whose localized problem IDs must remain present, e.g. origin/main",
    )
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    course = repo / "courses" / args.slug
    info = json.loads((course / "course-info.json").read_text(encoding="utf-8"))
    checked = 0
    archived_assignments = 0
    failures = []
    page_stats = []
    archive_pages = []
    for candidate in course.rglob("*.html"):
        candidate_html = candidate.read_text(encoding="utf-8")
        if candidate.name.startswith("archive-") or "Historical archive" in candidate_html or "历史存档" in candidate_html:
            archive_pages.append((candidate, extract_problem_ids(extract_outline(candidate_html))))

    if args.baseline_ref:
        verified = subprocess.run(
            ["git", "rev-parse", "--verify", "--quiet", f"{args.baseline_ref}^{{commit}}"],
            cwd=repo,
            capture_output=True,
            check=False,
        )
        if verified.returncode:
            print(f"ASSIGNMENT_LOCALIZATION_FAILED\n- invalid baseline Git ref: {args.baseline_ref}")
            return 1

    for item in info.get("assignments", []):
        relative = item.get("contentFile") or item.get("assGuideFile")
        if not relative:
            continue
        page = course / relative
        if not page.exists():
            failures.append(f"{relative}: file does not exist")
            continue
        baseline_html = read_git_page(repo, args.baseline_ref, page) if args.baseline_ref else None
        errors, stats = validate_page(page, baseline_html)
        if "COMPLETE_SOURCE_OUTLINE_START" in page.read_text(encoding="utf-8"):
            checked += 1
            page_stats.append((relative, stats))
        elif stats["baselineIds"]:
            archived_ids = {problem_id for _, problem_ids in archive_pages for problem_id in problem_ids}
            missing_from_archive = [problem_id for problem_id in stats["baselineIds"] if problem_id not in archived_ids]
            if missing_from_archive:
                errors.append(
                    "localized problem IDs disappeared from the active page and historical archives: "
                    + ", ".join(missing_from_archive)
                )
            else:
                archived_assignments += 1
                page_stats.append((relative, {**stats, "archived": len(stats["baselineIds"])}))
        failures.extend(f"{relative}: {error}" for error in errors)

    if failures:
        print("ASSIGNMENT_LOCALIZATION_FAILED")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"ASSIGNMENT_LOCALIZATION_OK activePages={checked} archivedAssignments={archived_assignments}")
    for relative, stats in page_stats:
        baseline = len(stats["baselineIds"])
        suffix = f" baseline={baseline}" if args.baseline_ref else ""
        archive_suffix = f" archived={stats.get('archived', 0)}" if stats.get("archived") else ""
        print(f"- {relative}: problems={stats['rows']} ids={len(stats['problemIds'])}{suffix}{archive_suffix}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
