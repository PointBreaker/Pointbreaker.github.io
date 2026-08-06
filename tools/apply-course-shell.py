#!/usr/bin/env python3
"""Attach CourseStack's shared reading shell to every course content page."""

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
COURSES = ("cs336", "cs267", "6.1810", "cs152")
STYLE_PATH = "assets/course/lesson.css"
STYLE_VERSION = "20260806b"
STYLE_MARKER = f"{STYLE_PATH}?v={STYLE_VERSION}"
SCRIPT_MARKER = "assets/course/lesson-ui.js"


def relative_asset_prefix(path: Path) -> str:
    depth = len(path.relative_to(ROOT).parts) - 1
    return "../" * depth


def update_page(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if STYLE_MARKER in text and SCRIPT_MARKER in text:
        return False
    prefix = relative_asset_prefix(path)
    stylesheet = f'  <link rel="stylesheet" href="{prefix}{STYLE_MARKER}">\n'
    script = f'  <script defer src="{prefix}{SCRIPT_MARKER}"></script>\n'
    if STYLE_PATH in text:
        text = re.sub(
            rf"({re.escape(STYLE_PATH)})(?:\?v=[^\"']*)?",
            STYLE_MARKER,
            text,
        )
    else:
        text = text.replace("</head>", f"{stylesheet}</head>", 1)
    if SCRIPT_MARKER not in text:
        text = text.replace("</body>", f"{script}</body>", 1)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    changed = []
    for course in COURSES:
        course_root = ROOT / course
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
