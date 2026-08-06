#!/usr/bin/env python3
"""Attach CourseStack's shared reading shell to every course content page."""

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STYLE_PATH = "assets/course/lesson.css"
STYLE_VERSION = "20260806d"
STYLE_MARKER = f"{STYLE_PATH}?v={STYLE_VERSION}"
SCRIPT_PATH = "assets/course/lesson-ui.js"
SCRIPT_MARKER = f"{SCRIPT_PATH}?v={STYLE_VERSION}"


def relative_asset_prefix(path: Path) -> str:
    depth = len(path.relative_to(ROOT).parts) - 1
    return "../" * depth


def update_page(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    text = original
    prefix = relative_asset_prefix(path)
    stylesheet = f'  <link rel="stylesheet" href="{prefix}{STYLE_MARKER}">\n'
    script = f'  <script defer src="{prefix}{SCRIPT_MARKER}"></script>\n'
    if STYLE_PATH in text:
        text = re.sub(
            rf"(?P<lead>href=[\"'])(?:\.\./)*{re.escape(STYLE_PATH)}(?:\?v=[^\"']*)?",
            rf"\g<lead>{prefix}{STYLE_MARKER}",
            text,
        )
    else:
        text = text.replace("</head>", f"{stylesheet}</head>", 1)
    if SCRIPT_PATH in text:
        text = re.sub(
            rf"(?P<lead>src=[\"'])(?:\.\./)*{re.escape(SCRIPT_PATH)}(?:\?v=[^\"']*)?",
            rf"\g<lead>{prefix}{SCRIPT_MARKER}",
            text,
        )
    else:
        text = text.replace("</body>", f"{script}</body>", 1)
    if text == original:
        return False
    path.write_text(text, encoding="utf-8")
    return True


def course_roots() -> list[Path]:
    catalog = json.loads((ROOT / "courses.json").read_text(encoding="utf-8"))
    return [(ROOT / item["path"]).resolve() for item in catalog.get("courses", [])]


def main() -> None:
    changed = []
    for course_root in course_roots():
        for path in sorted(course_root.rglob("*.html")):
            if path == course_root / "index.html":
                continue
            if update_page(path):
                changed.append(path.relative_to(ROOT).as_posix())
    print(f"Updated {len(changed)} course pages")
    for path in changed:
        print(path)


if __name__ == "__main__":
    main()
