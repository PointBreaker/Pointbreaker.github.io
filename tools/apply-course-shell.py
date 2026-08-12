#!/usr/bin/env python3
"""Attach CourseStack's shared reading shell to every course content page."""

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STYLE_PATH = "assets/course/lesson.css"
PLATFORM = json.loads((ROOT / "site-platform.json").read_text(encoding="utf-8"))
STYLE_VERSION = str(PLATFORM["sharedAssetVersion"])
STYLE_MARKER = f"{STYLE_PATH}?v={STYLE_VERSION}"
INTERACTIVE_STYLE_PATH = "assets/course/interactive.css"
INTERACTIVE_STYLE_MARKER = f"{INTERACTIVE_STYLE_PATH}?v={STYLE_VERSION}"
SCRIPT_PATH = "assets/course/lesson-ui.js"
SCRIPT_MARKER = f"{SCRIPT_PATH}?v={STYLE_VERSION}"
INTERACTIVE_SCRIPT_PATH = "assets/course/interactive.js"
INTERACTIVE_SCRIPT_MARKER = f"{INTERACTIVE_SCRIPT_PATH}?v={STYLE_VERSION}"
MATH_SCRIPT_PATH = "assets/course/math-render.js"
MATH_SCRIPT_MARKER = f"{MATH_SCRIPT_PATH}?v={STYLE_VERSION}"


def relative_asset_prefix(path: Path) -> str:
    depth = len(path.relative_to(ROOT).parts) - 1
    return "../" * depth


def update_page(path: Path) -> bool:
    with path.open("r", encoding="utf-8", newline="") as handle:
        original = handle.read()
    text = original
    prefix = relative_asset_prefix(path)
    stylesheet = f'  <link rel="stylesheet" href="{prefix}{STYLE_MARKER}">\n'
    interactive_stylesheet = f'  <link rel="stylesheet" href="{prefix}{INTERACTIVE_STYLE_MARKER}">\n'
    script = f'  <script defer src="{prefix}{SCRIPT_MARKER}"></script>\n'
    interactive_script = f'  <script defer src="{prefix}{INTERACTIVE_SCRIPT_MARKER}"></script>\n'
    math_script = f'  <script defer src="{prefix}{MATH_SCRIPT_MARKER}"></script>\n'
    if STYLE_PATH in text:
        text = re.sub(
            rf"(?P<lead>href=[\"'])(?:\.\./)*{re.escape(STYLE_PATH)}(?:\?v=[^\"']*)?",
            rf"\g<lead>{prefix}{STYLE_MARKER}",
            text,
        )
    else:
        text = text.replace("</head>", f"{stylesheet}</head>", 1)
    if INTERACTIVE_STYLE_PATH in text:
        text = re.sub(
            rf"(?P<lead>href=[\"'])(?:\.\./)*{re.escape(INTERACTIVE_STYLE_PATH)}(?:\?v=[^\"']*)?",
            rf"\g<lead>{prefix}{INTERACTIVE_STYLE_MARKER}",
            text,
        )
    else:
        text = text.replace("</head>", f"{interactive_stylesheet}</head>", 1)
    if INTERACTIVE_SCRIPT_PATH in text:
        text = re.sub(
            rf"(?P<lead>src=[\"'])(?:\.\./)*{re.escape(INTERACTIVE_SCRIPT_PATH)}(?:\?v=[^\"']*)?",
            rf"\g<lead>{prefix}{INTERACTIVE_SCRIPT_MARKER}",
            text,
        )
    else:
        text = text.replace("</body>", f"{interactive_script}</body>", 1)
    if MATH_SCRIPT_PATH in text:
        text = re.sub(
            rf"(?P<lead>src=[\"'])(?:\.\./)*{re.escape(MATH_SCRIPT_PATH)}(?:\?v=[^\"']*)?",
            rf"\g<lead>{prefix}{MATH_SCRIPT_MARKER}",
            text,
        )
    else:
        text = text.replace("</head>", f"{math_script}</head>", 1)
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
    with path.open("w", encoding="utf-8", newline="") as handle:
        handle.write(text)
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
