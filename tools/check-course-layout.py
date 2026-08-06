#!/usr/bin/env python3
"""Validate the shared courses/ layout and local static-site references."""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
from typing import Optional
from urllib.parse import unquote, urlsplit


DEFAULT_ROOT = Path(__file__).resolve().parents[1]
COURSES_ROOT = "courses"
PLATFORM_VERSION = 3


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
        parser = ReferenceParser()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
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
