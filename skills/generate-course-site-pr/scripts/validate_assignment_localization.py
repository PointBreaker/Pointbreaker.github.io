#!/usr/bin/env python3
import argparse
import json
import re
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


def validate_page(path: Path) -> list[str]:
    html = path.read_text(encoding="utf-8")
    if "COMPLETE_SOURCE_OUTLINE_START" not in html:
        return []

    errors = []
    before, rest = html.split("<!-- COMPLETE_SOURCE_OUTLINE_START -->", 1)
    outline = rest.split("<!-- COMPLETE_SOURCE_OUTLINE_END -->", 1)[0]
    rows = len(re.findall(r'class="problem-row"', outline))
    offline = len(re.findall(r'class="offline-ready"', outline))

    if not re.search(r'<html[^>]+lang="zh(?:-CN)?"', html, re.I):
        errors.append("page language is not zh/zh-CN")
    if rows == 0:
        errors.append("generated outline has no problem rows")
    if offline != rows:
        errors.append(f"offline markers {offline} do not match problem rows {rows}")
    if "assignment-guide" not in before and "<h2" not in before:
        errors.append("guide content is missing before the generated outline")
    if re.search(r'<a\s+[^>]*href=["\']https?://', outline, re.I):
        errors.append("problem outline contains an external link")

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
        for pattern in BARE_REFERENCE_PATTERNS:
            if pattern.search(student_text):
                errors.append(f"problem {index} still contains a bare exercise reference")
                break
        for pattern in RAW_MATH_PATTERNS:
            if pattern.search(student_body):
                errors.append(f"problem {index} contains raw math without KaTeX delimiters")
                break
        if re.search(r"水平[^。；\n]{0,24}(?:y\s*轴|纵轴)|(?:y\s*轴|纵轴)[^。；\n]{0,24}水平", student_text, re.I):
            errors.append(f"problem {index} contradicts horizontal direction and the y-axis")
        if re.search(r"竖直[^。；\n]{0,24}(?:x\s*轴|横轴)|(?:x\s*轴|横轴)[^。；\n]{0,24}竖直", student_text, re.I):
            errors.append(f"problem {index} contradicts vertical direction and the x-axis")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", required=True)
    parser.add_argument("--slug", required=True)
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    course = repo / "courses" / args.slug
    info = json.loads((course / "course-info.json").read_text(encoding="utf-8"))
    checked = 0
    failures = []

    for item in info.get("assignments", []):
        relative = item.get("contentFile") or item.get("assGuideFile")
        if not relative:
            continue
        page = course / relative
        if not page.exists():
            failures.append(f"{relative}: file does not exist")
            continue
        errors = validate_page(page)
        if "COMPLETE_SOURCE_OUTLINE_START" in page.read_text(encoding="utf-8"):
            checked += 1
        failures.extend(f"{relative}: {error}" for error in errors)

    if failures:
        print("ASSIGNMENT_LOCALIZATION_FAILED")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"ASSIGNMENT_LOCALIZATION_OK pages={checked}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
