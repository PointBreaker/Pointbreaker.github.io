#!/usr/bin/env python3
"""Validate the shared courses/ layout and local static-site references."""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from typing import Optional
from urllib.parse import unquote, urlsplit


DEFAULT_ROOT = Path(__file__).resolve().parents[1]
COURSES_ROOT = "courses"
PLATFORM_VERSION = 3
ASSET_VERSION_RE = re.compile(r"^\d{8}[a-z0-9]+$")
VERSIONED_READING_ASSETS = (
    "assets/course/lesson.css",
    "assets/course/interactive.css",
    "assets/course/lesson-ui.js",
    "assets/course/interactive.js",
    "assets/course/math-render.js",
)


class ReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {key: value or "" for key, value in attrs_list}
        for key in ("href", "src"):
            if attrs.get(key):
                self.references.append(attrs[key])

    def handle_startendtag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs_list)


def local_target(page: Path, value: str, root: Path) -> Optional[Path]:
    if value.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
        return None
    split = urlsplit(value)
    if split.scheme or split.netloc:
        return None
    path_text = unquote(split.path)
    if not path_text:
        return None
    if path_text.startswith("/"):
        return root / path_text.lstrip("/")
    return (page.parent / path_text).resolve()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=DEFAULT_ROOT)
    args = parser.parse_args()
    root = Path(args.root).expanduser().resolve()
    findings: list[str] = []
    platform_path = root / "site-platform.json"
    catalog_path = root / "courses.json"
    if not platform_path.is_file() or not catalog_path.is_file():
        print("missing site-platform.json or courses.json")
        return 1

    platform = json.loads(platform_path.read_text(encoding="utf-8"))
    if int(platform.get("version", 0)) < PLATFORM_VERSION:
        findings.append(f"site platform must be v{PLATFORM_VERSION}+")
    if platform.get("coursesRoot") != COURSES_ROOT:
        findings.append(f"site platform must declare coursesRoot={COURSES_ROOT!r}")
    shared_asset_version = str(platform.get("sharedAssetVersion", ""))
    if not ASSET_VERSION_RE.fullmatch(shared_asset_version):
        findings.append("site platform must declare a date-based sharedAssetVersion")

    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    seen_ids: set[str] = set()
    seen_paths: set[str] = set()
    for course in catalog.get("courses", []):
        course_id = str(course.get("id", ""))
        course_path = str(course.get("path", ""))
        expected_path = f"{COURSES_ROOT}/{course_id}/"
        if not course_id:
            findings.append("courses.json contains an entry without an id")
            continue
        if course_id in seen_ids:
            findings.append(f"duplicate course id: {course_id}")
        if course_path in seen_paths:
            findings.append(f"duplicate course path: {course_path}")
        seen_ids.add(course_id)
        seen_paths.add(course_path)
        if course_path != expected_path:
            findings.append(f"{course_id}: expected catalog path {expected_path}, got {course_path}")
        course_dir = root / COURSES_ROOT / course_id
        if not course_dir.is_dir():
            findings.append(f"{course_id}: missing directory {course_dir.relative_to(root)}")
        else:
            course_info_path = course_dir / "course-info.json"
            if course_info_path.is_file():
                course_info = json.loads(course_info_path.read_text(encoding="utf-8"))
                assignments_dir = course_dir / "lessons" / "assignments"
                for assignment in course_info.get("assignments", []):
                    guide_file = assignment.get("assGuideFile") or assignment.get("contentFile")
                    number = assignment.get("number")
                    if guide_file:
                        if not (course_dir / str(guide_file)).is_file():
                            findings.append(
                                f"{course_id}: assignment {number} guide does not exist: {guide_file}"
                            )
                        continue
                    try:
                        prefix = f"ass{int(number):02d}-"
                    except (TypeError, ValueError):
                        continue
                    local_guides = sorted(assignments_dir.glob(f"{prefix}*.html"))
                    if local_guides:
                        candidates = ", ".join(path.name for path in local_guides)
                        findings.append(
                            f"{course_id}: assignment {number} has local guide {candidates} "
                            "but no assGuideFile/contentFile"
                        )
        if (root / course_id).exists():
            findings.append(f"{course_id}: legacy root-level course directory still exists")

    html_roots = [root / "index.html", root / "404.html", root / "docs", root / COURSES_ROOT]
    pages: list[Path] = []
    for item in html_roots:
        if item.is_file():
            pages.append(item)
        elif item.is_dir():
            pages.extend(item.rglob("*.html"))

    for page in sorted(set(pages)):
        source = page.read_text(encoding="utf-8", errors="replace")
        parser = ReferenceParser()
        parser.feed(source)
        relative = page.relative_to(root)
        is_course_content = (
            len(relative.parts) >= 3
            and relative.parts[0] == COURSES_ROOT
            and relative.parts[2:] != ("index.html",)
        )
        if is_course_content and shared_asset_version:
            for asset in VERSIONED_READING_ASSETS:
                reference_count = source.count(asset)
                if reference_count != 1:
                    findings.append(
                        f"{relative}: expected one shared reading asset reference, found {reference_count}: {asset}"
                    )
                if f"{asset}?v={shared_asset_version}" not in source:
                    findings.append(
                        f"{relative}: shared reading asset is not pinned to {shared_asset_version}: {asset}"
                    )
        for reference in parser.references:
            target = local_target(page, reference, root)
            if target is None:
                continue
            try:
                target.relative_to(root)
            except ValueError:
                findings.append(f"{page.relative_to(root)}: local reference escapes repository: {reference}")
                continue
            if not target.exists():
                findings.append(f"{page.relative_to(root)}: missing local reference: {reference}")

    if findings:
        print("\n".join(findings))
        return 1
    print(f"COURSE_LAYOUT_OK courses={len(seen_ids)} html={len(pages)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
