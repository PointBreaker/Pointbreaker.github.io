#!/usr/bin/env python3
"""Report structural evidence for Engineering Workbooks and historical recaps.

Guided Discussion workbooks are intentionally delegated to
audit_discussion_coverage.py because their statuses and evidence contract differ.
"""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import sys


ALLOWED = {"GOLD", "GOOD", "SHALLOW", "BLOCKED_BY_SOURCE"}
RECAP_EVIDENCE = {
    "attributionMap": "attribution-map", "stateMap": "state-map",
    "codeMechanism": "code-mechanism", "executionTrace": "execution-trace",
    "counterfactual": "counterfactual", "codePrediction": "code-prediction",
    "bugReconstruction": "bug-reconstruction",
    "closedBook": "closed-book-reconstruction", "lessonLinks": "lesson-links",
}
WORKBOOK_EVIDENCE = {
    "contract": "engineering-contract", "stages": "stage-grid",
    "sanity": "sanity-check", "failureSignatures": "failure-signatures",
    "predictionLoop": "prediction-loop", "closedBook": "closed-book-reconstruction",
    "lessonLinks": "lesson-links",
}


class Scan(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.classes: dict[str, int] = {}
        self.body: dict[str, str] = {}
        self.text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if tag == "body": self.body = values
        for name in values.get("class", "").split():
            self.classes[name] = self.classes.get(name, 0) + 1

    def handle_data(self, data: str) -> None:
        self.text.append(data)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo", required=True)
    ap.add_argument("--slug", required=True)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    repo = Path(args.repo).resolve()
    folder = repo / "courses" / args.slug / "lessons" / "assignments"
    rows, errors = [], []
    for path in sorted(folder.glob("*.html")):
        scan = Scan(); scan.feed(path.read_text(encoding="utf-8", errors="replace"))
        profile = scan.body.get("data-workbook-profile", "")
        if not profile: continue
        if profile == "guided-reasoning-workbook": continue
        status = scan.body.get("data-workbook-status", "UNDECLARED")
        recap_depth = scan.body.get("data-recap-depth", "")
        expected = RECAP_EVIDENCE if profile == "historical-implementation-recap" else WORKBOOK_EVIDENCE
        evidence = {key: scan.classes.get(cls, 0) for key, cls in expected.items()}
        text = " ".join(scan.text)
        rows.append({"file": path.relative_to(repo).as_posix(), "profile": profile,
                     "status": status, "recapDepth": recap_depth, "evidence": evidence})
        if status not in ALLOWED: errors.append(f"{path.name}: invalid status {status!r}")
        if status == "GOLD" or recap_depth == "GOLD":
            missing = [key for key, count in evidence.items() if not count]
            if missing: errors.append(f"{path.name}: Gold evidence missing: {', '.join(missing)}")
        if profile == "historical-implementation-recap":
            for marker in ("YOUR CODE · Historical Implementation", "Framework Context"):
                if marker not in text: errors.append(f"{path.name}: missing attribution marker {marker!r}")
            if "≠" not in text: errors.append(f"{path.name}: current/historical boundary is not explicit")
    payload = {"slug": args.slug, "workbookCount": len(rows), "workbooks": rows,
               "errors": errors, "note": "Structural evidence only; attribution and Gold depth require human review."}
    if args.json: print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        for row in rows:
            present = sum(bool(v) for v in row["evidence"].values())
            print(f"{Path(row['file']).name}: {row['status']} {row['profile']} evidence={present}/{len(row['evidence'])}")
        for error in errors: print(f"ERROR: {error}", file=sys.stderr)
        print(payload["note"])
    return 1 if errors else 0


if __name__ == "__main__": raise SystemExit(main())
