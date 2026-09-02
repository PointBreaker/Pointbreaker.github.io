#!/usr/bin/env python3
"""Report structural evidence for CourseStack lesson depth.

This is deliberately a regression detector, not an automatic pedagogy score. It
can prove that expected evidence is absent; only a human review can prove that
the explanation is correct, coherent, and genuinely useful.
"""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys


ALLOWED_STATUSES = {"GOLD", "GOOD", "SHALLOW", "BLOCKED_BY_SOURCE"}
GOLD_EVIDENCE = {
    "workedTrace": "worked-trace",
    "counterfactual": "counterfactual",
    "misconceptionAnalysis": "misconception-analysis",
    "conceptChecks": "concept-check",
    "deepChecks": "deep-checks",
    "explainYourself": "explain-yourself",
    "implementationMapping": "implementation-map",
}


class EvidenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.classes: dict[str, int] = {}
        self.quiz_ids: list[str] = []
        self.depth_status = ""

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {key: value or "" for key, value in attrs_list}
        if tag == "body":
            self.depth_status = attrs.get("data-depth-status", "")
        for name in attrs.get("class", "").split():
            self.classes[name] = self.classes.get(name, 0) + 1
        if "data-quiz" in attrs:
            self.quiz_ids.append(attrs["data-quiz"])


def lesson_number(path: Path) -> int | None:
    match = re.match(r"0*(\d+)-", path.name)
    return int(match.group(1)) if match else None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    course = repo / "courses" / args.slug
    info_path = course / "course-info.json"
    if not info_path.is_file():
        print(f"missing course metadata: {info_path}", file=sys.stderr)
        return 2

    info = json.loads(info_path.read_text(encoding="utf-8"))
    gold_lessons = set(info.get("qualityContract", {}).get("goldLessons", []))
    results: list[dict] = []
    errors: list[str] = []

    if not info.get("courseTypeProfiles"):
        errors.append("course-info.json has no courseTypeProfiles")
    if not gold_lessons:
        errors.append("course-info.json qualityContract has no goldLessons")

    for path in sorted((course / "lessons").glob("*.html")):
        number = lesson_number(path)
        if number is None:
            continue
        source = path.read_text(encoding="utf-8", errors="replace")
        evidence = EvidenceParser()
        evidence.feed(source)
        declared = evidence.depth_status or "UNDECLARED"
        detected = {key: evidence.classes.get(class_name, 0) for key, class_name in GOLD_EVIDENCE.items()}
        row = {
            "lesson": number,
            "file": path.relative_to(repo).as_posix(),
            "declaredStatus": declared,
            "goldDeclared": number in gold_lessons,
            "quizCount": len(evidence.quiz_ids),
            "uniqueQuizIds": len(evidence.quiz_ids) == len(set(evidence.quiz_ids)),
            "evidence": detected,
        }
        results.append(row)

        if declared not in ALLOWED_STATUSES:
            errors.append(f"L{number}: invalid or missing data-depth-status {declared!r}")
        if len(evidence.quiz_ids) != len(set(evidence.quiz_ids)):
            errors.append(f"L{number}: duplicate data-quiz values")
        if number in gold_lessons:
            if declared != "GOLD":
                errors.append(f"L{number}: listed as Gold but declares {declared}")
            missing = [key for key, count in detected.items() if count < 1]
            if missing:
                errors.append(f"L{number}: Gold structural evidence missing: {', '.join(missing)}")
            if len(evidence.quiz_ids) < 5:
                errors.append(f"L{number}: Gold lesson has only {len(evidence.quiz_ids)} interactive checks; expected at least 5")

    payload = {
        "slug": args.slug,
        "courseTypeProfiles": info.get("courseTypeProfiles", []),
        "goldLessons": sorted(gold_lessons),
        "lessonCount": len(results),
        "lessons": results,
        "errors": errors,
        "note": "Structural evidence only; GOLD still requires human-quality review.",
    }
    if args.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        for row in results:
            count = sum(1 for value in row["evidence"].values() if value)
            print(f"L{row['lesson']:02d} {row['declaredStatus']:<17} quizzes={row['quizCount']} evidence={count}/{len(GOLD_EVIDENCE)}")
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        print(payload["note"])
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
