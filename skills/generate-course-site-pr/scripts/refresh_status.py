#!/usr/bin/env python3
"""Refresh static api/status.json after course pages are generated."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys


TODO_MARKER = "COURSE_CONTENT_TODO"


def is_complete(path: Path) -> bool:
    return path.is_file() and TODO_MARKER not in path.read_text(encoding="utf-8", errors="replace")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--slug", required=True)
    args = parser.parse_args()

    course = Path(args.repo).expanduser().resolve() / args.slug
    info_path = course / "course-info.json"
    if not info_path.is_file():
        parser.error(f"missing course-info.json: {info_path}")
    info = json.loads(info_path.read_text(encoding="utf-8"))

    lectures = []
    completed = 0
    for lecture in info.get("lectures", []):
        relative = lecture.get("lessonFile", "")
        complete = bool(relative) and is_complete(course / relative)
        if complete:
            completed += 1
        lectures.append({**lecture, "status": "completed" if complete else "upcoming", "lessonFile": relative or None})

    assignments = []
    for item in info.get("assignments", []):
        relative = item.get("assGuideFile", "")
        assignments.append({**item, "assGuideFile": relative if relative and is_complete(course / relative) else None})

    payload = {
        "lectures": lectures,
        "assignments": assignments,
        "workItemLabel": info.get("workItemLabel", "Guides"),
        "generatedCount": completed,
        "totalLectures": len(lectures),
    }
    output = course / "api" / "status.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"completed": completed, "total": len(lectures), "output": str(output)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
