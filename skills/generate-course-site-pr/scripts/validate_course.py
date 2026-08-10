#!/usr/bin/env python3
"""Validate a generated CourseStack v3 course before opening a pull request."""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

from validate_interactive import validate_interactives


TODO_MARKER = "COURSE_CONTENT_TODO"
DOLLAR_MATH_RE = re.compile(r"(?<!\\)\$[^$\n]{1,300}(?<!\\)\$")
PRIMARY_KINDS = {"syllabus", "lecture", "assignment", "lab", "project"}
PLATFORM_VERSION = 3
COURSES_ROOT = "courses"
EXAM_RE = re.compile(r"\b(exam|quiz|midterm|final)\b|考试|测验|期中|期末", re.IGNORECASE)
FINAL_RE = re.compile(r"\bfinal\b|期末", re.IGNORECASE)


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[str] = []
        self.quizzes: list[dict] = []
        self.quiz_stack: list[dict] = []
        self.tag_stack: list[tuple[str, bool]] = []
        self.h1_count = 0

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {key: value or "" for key, value in attrs_list}
        if tag == "h1":
            self.h1_count += 1
        for key in ("href", "src"):
            if attrs.get(key):
                self.refs.append(attrs[key])
        classes = set(attrs.get("class", "").split())
        opens_quiz = "quiz" in classes or "data-quiz" in attrs
        if opens_quiz:
            quiz = {"answer": attrs.get("data-answer"), "choices": [], "id": attrs.get("data-quiz", "?")}
            self.quizzes.append(quiz)
            self.quiz_stack.append(quiz)
        if tag == "button" and self.quiz_stack:
            choice = attrs.get("data-choice")
            if choice:
                self.quiz_stack[-1]["choices"].append(choice)
        self.tag_stack.append((tag, opens_quiz))

    def handle_startendtag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs_list)
        self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        if not self.tag_stack:
            return
        for index in range(len(self.tag_stack) - 1, -1, -1):
            if self.tag_stack[index][0] == tag:
                closing = self.tag_stack[index:]
                self.tag_stack = self.tag_stack[:index]
                for _, opened_quiz in reversed(closing):
                    if opened_quiz and self.quiz_stack:
                        self.quiz_stack.pop()
                return


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def strip_protected_blocks(source: str) -> str:
    return re.sub(r"<(script|style|pre|code|textarea)\b[^>]*>.*?</\1>", "", source, flags=re.IGNORECASE | re.DOTALL)


def validate_local_ref(page: Path, repo: Path, value: str) -> str | None:
    if value.startswith(("#", "mailto:", "tel:", "data:")):
        return None
    split = urlsplit(value)
    if split.scheme or split.netloc:
        return None
    path_text = unquote(split.path)
    if not path_text:
        return None
    target = (page.parent / path_text).resolve()
    try:
        target.relative_to(repo.resolve())
    except ValueError:
        return f"local reference escapes repository: {value}"
    if not target.exists():
        return f"missing local reference: {value}"
    return None


def page_errors(page: Path, repo: Path, course: Path, shared_asset_version: str) -> list[str]:
    source = page.read_text(encoding="utf-8", errors="replace")
    errors: list[str] = []
    label = page.relative_to(course).as_posix()
    if TODO_MARKER in source or re.search(r"\bTODO\b|\bTBD\b", source):
        errors.append(f"{label}: contains placeholder text")
    parser = PageParser()
    try:
        parser.feed(source)
    except Exception as exc:
        errors.append(f"{label}: HTML parser error: {exc}")
    if page.name != "index.html" and parser.h1_count != 1:
        errors.append(f"{label}: expected exactly one h1, found {parser.h1_count}")
    for ref in parser.refs:
        error = validate_local_ref(page, repo, ref)
        if error:
            errors.append(f"{label}: {error}")
    if page.name != "index.html":
        if "assets/course/lesson.css" not in source or "assets/course/lesson-ui.js" not in source:
            errors.append(f"{label}: missing shared CourseStack reading shell")
        if "assets/course/interactive.css" not in source or "assets/course/interactive.js" not in source:
            errors.append(f"{label}: missing shared CourseStack interactive runtime")
        if f"assets/course/lesson.css?v={shared_asset_version}" not in source:
            errors.append(f"{label}: shared lesson stylesheet is missing cache version {shared_asset_version}")
        if f"assets/course/lesson-ui.js?v={shared_asset_version}" not in source:
            errors.append(f"{label}: shared lesson UI is missing cache version {shared_asset_version}")
        if f"assets/course/interactive.css?v={shared_asset_version}" not in source:
            errors.append(f"{label}: shared interactive stylesheet is missing cache version {shared_asset_version}")
        if f"assets/course/interactive.js?v={shared_asset_version}" not in source:
            errors.append(f"{label}: shared interactive runtime is missing cache version {shared_asset_version}")
        for quiz in parser.quizzes:
            if not quiz["answer"]:
                errors.append(f"{label}: quiz {quiz['id']} missing data-answer")
            elif quiz["answer"] not in quiz["choices"]:
                errors.append(f"{label}: quiz {quiz['id']} answer {quiz['answer']!r} has no matching choice")
            if len(quiz["choices"]) < 2:
                errors.append(f"{label}: quiz {quiz['id']} has fewer than two choices")
        relative_parts = set(page.relative_to(course).parts)
        is_work_item = bool(relative_parts & {"assignments", "work-items"})
        if not parser.quizzes and not is_work_item:
            errors.append(f"{label}: contains no quizzes")
    visible = strip_protected_blocks(source)
    if DOLLAR_MATH_RE.search(visible):
        errors.append(f"{label}: contains unsupported $...$ math delimiters")
    for left, right in ((r"\(", r"\)"), (r"\[", r"\]")):
        if visible.count(left) != visible.count(right):
            errors.append(f"{label}: unbalanced math delimiters {left} / {right}")
    if page.name != "index.html" and not re.search(r"参考资料|主要来源|一手资料|Sources?", visible, re.IGNORECASE):
        errors.append(f"{label}: missing primary-source reference section")
    return errors


def expected_pages(plan: dict) -> tuple[set[int], set[int]]:
    return ({item["number"] for item in plan.get("lectures", [])}, {item["number"] for item in plan.get("workItems", [])})


def mapped_sources(plan: dict) -> set[str]:
    mapped = set(plan.get("sourceFiles", []))
    for key in ("lectures", "workItems"):
        for item in plan.get(key, []):
            mapped.update(item.get("sourceFiles", []))
    return mapped


def item_text(item: dict) -> str:
    return " ".join(str(item.get(key, "")) for key in ("kind", "type", "title", "titleZh"))


def dependency_boundary(item: dict) -> int:
    values = [value for value in item.get("dependsOn", []) if isinstance(value, int)]
    return max(values, default=0)


def validate_learning_graph(course: Path, info: dict, status: dict) -> list[str]:
    errors: list[str] = []
    lectures = status.get("lectures") or info.get("lectures") or []
    lecture_numbers = {item.get("number") for item in lectures if isinstance(item.get("number"), int)}
    assignments = info.get("assignments") or status.get("assignments") or []
    work_numbers = [item.get("number") for item in assignments]
    if len(work_numbers) != len(set(work_numbers)):
        errors.append("course-info assignments must use unique numbers")

    for item in assignments:
        number = item.get("number", "?")
        dependencies = item.get("dependsOn")
        if not isinstance(dependencies, list):
            errors.append(f"work item {number} dependsOn must be a list")
            continue
        invalid_types = [value for value in dependencies if not isinstance(value, int) or value < 1]
        if invalid_types:
            errors.append(f"work item {number} has non-positive or non-integer dependsOn values: {invalid_types}")
        unknown = sorted(set(value for value in dependencies if isinstance(value, int)) - lecture_numbers)
        if unknown:
            errors.append(f"work item {number} references missing lectures: {unknown}")

        relative = item.get("assGuideFile") or item.get("contentFile")
        if not relative:
            errors.append(f"work item {number} has no assGuideFile or contentFile")
        elif urlsplit(str(relative)).scheme or urlsplit(str(relative)).netloc:
            errors.append(f"work item {number} must use a course-local guide file: {relative}")
        else:
            target = (course / str(relative)).resolve()
            try:
                target.relative_to(course.resolve())
            except ValueError:
                errors.append(f"work item {number} guide file escapes the course directory: {relative}")
            else:
                if not target.is_file():
                    errors.append(f"work item {number} guide file does not exist: {relative}")

    exams = [item for item in assignments if EXAM_RE.search(item_text(item))]
    if not exams:
        return errors
    if not lecture_numbers:
        errors.append("exam-based learning graph has no lectures")
        return errors

    ordered_exams = sorted(
        exams,
        key=lambda item: (bool(FINAL_RE.search(item_text(item))), dependency_boundary(item), item.get("number", 0)),
    )
    last_lecture = max(lecture_numbers)
    boundaries = [last_lecture if FINAL_RE.search(item_text(item)) else dependency_boundary(item) for item in ordered_exams]
    if any(boundary < 1 for boundary in boundaries):
        errors.append("every exam must depend on at least one lecture")
    if boundaries != sorted(boundaries):
        errors.append(f"exam stage boundaries are not chronological: {boundaries}")
    final_count = sum(bool(FINAL_RE.search(item_text(item))) for item in exams)
    if final_count > 1:
        errors.append("learning graph contains more than one final exam")

    last_boundary = max(boundaries, default=0)
    homework = [item for item in assignments if item not in exams]
    unplaced = [item.get("number") for item in homework if dependency_boundary(item) > last_boundary]
    if unplaced:
        errors.append(f"homework items fall after the final exam stage: {unplaced}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--plan")
    parser.add_argument("--inventory")
    parser.add_argument("--strict-resources", action="store_true")
    args = parser.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    errors: list[str] = []
    warnings: list[str] = []
    platform_path = repo / "site-platform.json"
    catalog_path = repo / "courses.json"
    platform = load_json(platform_path) if platform_path.is_file() else {}
    courses_root = platform.get("coursesRoot", COURSES_ROOT)
    shared_asset_version = str(platform.get("sharedAssetVersion", ""))
    course = repo / courses_root / args.slug
    interactive_stats = {"interactiveEmbeds": 0, "interactiveSpecs": 0}
    required = [course / "index.html", course / "course-info.json", course / "api/status.json", platform_path, catalog_path]
    for path in required:
        if not path.is_file():
            errors.append(f"missing required file: {path.relative_to(repo)}")
    if platform_path.is_file() and int(load_json(platform_path).get("version", 0)) < PLATFORM_VERSION:
        errors.append(f"CourseStack platform v{PLATFORM_VERSION}+ is required")
    if platform_path.is_file() and courses_root != COURSES_ROOT:
        errors.append(f"CourseStack platform must use coursesRoot={COURSES_ROOT!r}")
    if platform_path.is_file() and not shared_asset_version:
        errors.append("CourseStack platform must declare sharedAssetVersion")
    if (repo / args.slug).exists():
        errors.append(f"legacy root-level course directory must not exist: {args.slug}")
    if not course.is_dir():
        errors.append(f"missing course directory: {course}")
    else:
        for page in sorted(course.rglob("*.html")):
            errors.extend(page_errors(page, repo, course, shared_asset_version))
        interactive_errors, interactive_stats = validate_interactives(repo, course)
        errors.extend(interactive_errors)

    plan = load_json(Path(args.plan).expanduser().resolve()) if args.plan else None
    if plan and course.is_dir():
        expected_lectures, expected_work = expected_pages(plan)
        actual_lectures = {int(match.group(1)) for path in (course / "lessons").glob("*.html") if (match := re.match(r"^(\d{4})-", path.name))}
        actual_work = {int(match.group(1)) for path in (course / "lessons" / "assignments").glob("*.html") if (match := re.match(r"^ass(\d+)-", path.name))}
        if actual_lectures != expected_lectures:
            errors.append(f"lecture page numbers differ from plan: expected {sorted(expected_lectures)}, got {sorted(actual_lectures)}")
        if actual_work != expected_work:
            errors.append(f"work-item page numbers differ from plan: expected {sorted(expected_work)}, got {sorted(actual_work)}")

    if catalog_path.is_file():
        expected_path = f"{courses_root}/{args.slug}/"
        matches = [item for item in load_json(catalog_path).get("courses", []) if item.get("id") == args.slug and item.get("path") == expected_path]
        if len(matches) != 1:
            errors.append(f"courses.json must contain exactly one entry for {args.slug}")

    if args.inventory and plan:
        inventory = load_json(Path(args.inventory).expanduser().resolve())
        mapped = mapped_sources(plan)
        known = {entry["path"] for entry in inventory.get("files", [])}
        missing = sorted(mapped - known)
        if missing:
            errors.append("plan references missing source files: " + ", ".join(missing))
        unmapped = sorted(entry["path"] for entry in inventory.get("files", []) if entry.get("kind") in PRIMARY_KINDS and entry["path"] not in mapped)
        if unmapped:
            message = "unmapped primary resources: " + ", ".join(unmapped)
            (errors if args.strict_resources else warnings).append(message)

    info_path = course / "course-info.json"
    status_path = course / "api" / "status.json"
    if status_path.is_file():
        status = load_json(status_path)
        if status.get("generatedCount") != status.get("totalLectures"):
            errors.append(f"status reports incomplete lectures: {status.get('generatedCount')} / {status.get('totalLectures')}")
        missing_guides = [item.get("number") for item in status.get("assignments", []) if not item.get("assGuideFile")]
        if missing_guides:
            errors.append(f"status reports incomplete work-item guides: {missing_guides}")
        if info_path.is_file():
            errors.extend(validate_learning_graph(course, load_json(info_path), status))

    result = {
        "course": str(course),
        "errors": errors,
        "warnings": warnings,
        "stats": {
            "htmlPages": len(list(course.rglob("*.html"))) if course.is_dir() else 0,
            "lecturePages": len(list((course / "lessons").glob("*.html"))) if course.is_dir() else 0,
            "workItemPages": len(list((course / "lessons" / "assignments").glob("*.html"))) if course.is_dir() else 0,
            **interactive_stats,
        },
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
