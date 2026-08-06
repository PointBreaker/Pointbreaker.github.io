#!/usr/bin/env python3
"""Scaffold a CourseStack v2 course from a reviewed course-plan JSON file."""

from __future__ import annotations

import argparse
import html
import json
from pathlib import Path
import re
import sys


SLUG_RE = re.compile(r"^[a-z0-9]+(?:[.-][a-z0-9]+)*$")
PLATFORM_VERSION = 2
TODO_MARKER = "COURSE_CONTENT_TODO"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def slugify(value: str, fallback: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or fallback


def validate_plan(plan: dict) -> None:
    required = [
        "courseCode", "course", "shortTitle", "slug", "university", "homepage",
        "domain", "summary", "lectures",
    ]
    missing = [key for key in required if not plan.get(key)]
    if missing:
        raise ValueError("missing required plan keys: " + ", ".join(missing))
    if not SLUG_RE.fullmatch(plan["slug"]):
        raise ValueError("slug must contain lowercase letters, digits, dots, or hyphens")
    lectures = plan.get("lectures", [])
    numbers = [item.get("number") for item in lectures]
    if not lectures or any(not isinstance(number, int) or number < 1 for number in numbers):
        raise ValueError("lectures must use positive integer numbers")
    if len(numbers) != len(set(numbers)):
        raise ValueError("lecture numbers must be unique")
    known = set(numbers)
    work_items = plan.get("workItems") or []
    if not work_items:
        work_items = [{
            "number": 1,
            "kind": "Module",
            "title": "Course sequence",
            "released": "",
            "due": "",
            "description": "按课程顺序完成全部内容。",
            "dependsOn": numbers,
            "slug": "course-sequence",
            "sourceFiles": [],
        }]
        plan["workItems"] = work_items
    work_numbers = [item.get("number") for item in work_items]
    if any(not isinstance(number, int) or number < 1 for number in work_numbers):
        raise ValueError("work item numbers must be positive integers")
    if len(work_numbers) != len(set(work_numbers)):
        raise ValueError("work item numbers must be unique")
    for item in work_items:
        invalid = set(item.get("dependsOn", [])) - known
        if invalid:
            raise ValueError(f"work item {item['number']} has invalid dependsOn values: {sorted(invalid)}")


def check_platform(repo: Path) -> dict:
    platform_path = repo / "site-platform.json"
    catalog_path = repo / "courses.json"
    if not platform_path.is_file() or not catalog_path.is_file():
        raise RuntimeError("target repository is missing CourseStack v2 platform files")
    platform = load_json(platform_path)
    if int(platform.get("version", 0)) < PLATFORM_VERSION:
        raise RuntimeError(f"CourseStack platform v{PLATFORM_VERSION}+ is required")
    for relative in platform.get("sharedAssets", {}).values():
        if not (repo / relative).is_file():
            raise RuntimeError(f"missing shared platform asset: {relative}")
    return platform


def lecture_filename(lecture: dict) -> str:
    number = lecture["number"]
    slug = slugify(lecture.get("slug") or lecture.get("title", ""), f"lecture-{number:02d}")
    lecture["slug"] = slug
    return f"{number:04d}-{slug}.html"


def work_filename(item: dict) -> str:
    number = item["number"]
    slug = slugify(item.get("slug") or item.get("title", ""), f"work-{number:02d}")
    item["slug"] = slug
    return f"ass{number:02d}-{slug}.html"


def dashboard_page(plan: dict) -> str:
    code = html.escape(plan["courseCode"])
    description = html.escape(plan.get("summary", plan["course"]))
    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{description}">
  <title>{code} — CourseStack 课栈</title>
  <link rel="stylesheet" href="../assets/course/dashboard.css">
  <script defer src="../assets/course/dashboard.js"></script>
</head>
<body><div id="course-app"></div></body>
</html>
'''


def stub_page(course_code: str, number: int, title: str, kind: str, root_prefix: str, sources: list[str], guide: bool) -> str:
    safe_title = html.escape(title)
    safe_course = html.escape(course_code)
    source_items = "\n".join(f"      <li><code>{html.escape(item)}</code></li>" for item in sources)
    guide_css = f'  <link rel="stylesheet" href="{root_prefix}assets/course/guide.css">\n' if guide else ""
    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{safe_title} — {safe_course}</title>
  <link rel="stylesheet" href="{root_prefix}assets/course/base.css">
{guide_css}  <link rel="stylesheet" href="{root_prefix}assets/vendor/prism.css">
  <link rel="stylesheet" href="{root_prefix}assets/vendor/katex.min.css">
  <link rel="stylesheet" href="{root_prefix}assets/course/lesson.css">
  <script defer src="{root_prefix}assets/vendor/katex.min.js"></script>
  <script defer src="{root_prefix}assets/vendor/katex-auto-render.min.js"></script>
  <script defer src="{root_prefix}assets/course/math-render.js"></script>
</head>
<body>
  <div class="page">
    <p class="eyebrow">{safe_course} · {html.escape(kind)} {number}</p>
    <h1>{safe_title}</h1>
    <p class="lede">{TODO_MARKER}：请依据列出的一手资料完成本页。</p>
    <!-- {TODO_MARKER} -->
    <h2 id="sources">一手资料</h2>
    <ul>
{source_items or '      <li>尚未映射本地资料</li>'}
    </ul>
  </div>
  <script src="{root_prefix}assets/vendor/prism.js"></script>
  <script src="{root_prefix}assets/vendor/prism-python.js"></script>
  <script src="{root_prefix}assets/vendor/prism-bash.js"></script>
  <script src="{root_prefix}assets/course/quiz.js"></script>
  <script defer src="{root_prefix}assets/course/lesson-ui.js"></script>
</body>
</html>
'''


def add_catalog_entry(repo: Path, plan: dict) -> None:
    catalog_path = repo / "courses.json"
    catalog = load_json(catalog_path)
    courses = catalog.setdefault("courses", [])
    if any(item.get("id") == plan["slug"] or item.get("path") == f"{plan['slug']}/" for item in courses):
        raise RuntimeError(f"course catalog already contains {plan['slug']}")
    courses.append({
        "id": plan["slug"],
        "path": f"{plan['slug']}/",
        "code": plan["courseCode"],
        "title": plan["shortTitle"],
        "titleZh": plan.get("titleZh", ""),
        "university": plan["university"],
        "term": plan.get("term", ""),
        "domain": plan["domain"],
        "domainKey": plan.get("domainKey") or slugify(plan["domain"], "course"),
        "summary": plan["summary"],
        "tags": plan.get("tags", []),
        "lectures": len(plan["lectures"]),
        "workItems": len(plan.get("workItems", [])),
        "workLabel": plan.get("workItemLabel", "Guides"),
        "accent": plan.get("accent", "#63e68c"),
        "featured": bool(plan.get("featured", False)),
    })
    write_json(catalog_path, catalog)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--plan", required=True)
    args = parser.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    plan_path = Path(args.plan).expanduser().resolve()
    if not (repo / ".git").exists() or not (repo / "index.html").is_file():
        parser.error(f"not a CourseStack site clone: {repo}")
    check_platform(repo)
    plan = load_json(plan_path)
    validate_plan(plan)

    course_dir = repo / plan["slug"]
    if course_dir.exists():
        raise RuntimeError(f"course directory already exists: {course_dir}")
    (course_dir / "lessons" / "assignments").mkdir(parents=True)

    lecture_records = []
    for lecture in sorted(plan["lectures"], key=lambda item: item["number"]):
        filename = lecture_filename(lecture)
        record = dict(lecture)
        record["lessonFile"] = f"lessons/{filename}"
        lecture_records.append(record)
        page = stub_page(plan["courseCode"], lecture["number"], lecture["title"], "第", "../../", lecture.get("sourceFiles", []), False)
        (course_dir / "lessons" / filename).write_text(page, encoding="utf-8")

    assignment_records = []
    for item in sorted(plan["workItems"], key=lambda value: value["number"]):
        filename = work_filename(item)
        record = dict(item)
        record["assGuideFile"] = f"lessons/assignments/{filename}"
        assignment_records.append(record)
        page = stub_page(plan["courseCode"], item["number"], item["title"], item.get("kind", "Assignment"), "../../../", item.get("sourceFiles", []), True)
        (course_dir / "lessons" / "assignments" / filename).write_text(page, encoding="utf-8")

    course_info = {
        "id": plan["slug"],
        "code": plan["courseCode"],
        "title": plan["shortTitle"],
        "titleZh": plan.get("titleZh", ""),
        "course": plan["course"],
        "university": plan["university"],
        "instructors": plan.get("instructors", []),
        "term": plan.get("term", ""),
        "domain": plan["domain"],
        "language": plan.get("language", "中文深度讲义"),
        "homepage": plan["homepage"],
        "sourceUrl": plan["homepage"],
        "sourceLabel": plan.get("sourceLabel", "官方课程主页"),
        "summary": plan["summary"],
        "tags": plan.get("tags", []),
        "accent": plan.get("accent", "#63e68c"),
        "workItemLabel": plan.get("workItemLabel", "Guides"),
        "lectures": lecture_records,
        "assignments": assignment_records,
    }
    write_json(course_dir / "course-info.json", course_info)
    write_json(course_dir / "api" / "status.json", {
        "lectures": [{**record, "status": "upcoming"} for record in lecture_records],
        "assignments": assignment_records,
        "workItemLabel": course_info["workItemLabel"],
        "generatedCount": 0,
        "totalLectures": len(lecture_records),
    })
    (course_dir / "index.html").write_text(dashboard_page(plan), encoding="utf-8")
    add_catalog_entry(repo, plan)
    print(json.dumps({"course": str(course_dir), "lectures": len(lecture_records), "workItems": len(assignment_records)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, RuntimeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(1)
