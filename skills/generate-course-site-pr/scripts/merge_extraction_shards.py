#!/usr/bin/env python3
"""Merge schema-valid work-item extraction shards without rewriting model text."""

from __future__ import annotations

import argparse
from copy import deepcopy
import json
from pathlib import Path
from typing import Any


def identity(document: dict[str, Any]) -> tuple[str, str]:
    return str(document.get("kind", "")), str(document.get("number", ""))


def append_unique(target: list[Any], values: list[Any]) -> None:
    fingerprints = {json.dumps(item, ensure_ascii=False, sort_keys=True) for item in target}
    for value in values:
        fingerprint = json.dumps(value, ensure_ascii=False, sort_keys=True)
        if fingerprint not in fingerprints:
            target.append(deepcopy(value))
            fingerprints.add(fingerprint)


def merge_documents(existing: dict[str, Any], incoming: dict[str, Any]) -> None:
    if identity(existing) != identity(incoming):
        raise ValueError(f"document identity mismatch: {identity(existing)} != {identity(incoming)}")
    for field in ("sourceFiles", "solutionSourceFiles"):
        existing_sources = set(existing.get(field) or [])
        incoming_sources = set(incoming.get(field) or [])
        if existing_sources != incoming_sources:
            raise ValueError(
                f"{identity(existing)} {field} mismatch: "
                f"{sorted(existing_sources)} != {sorted(incoming_sources)}"
            )
    for field in ("topicKeywords", "suggestedDependsOn"):
        append_unique(existing.setdefault(field, []), incoming.get(field) or [])

    problems = existing.setdefault("problems", [])
    problem_ids = {str(item.get("id", "")) for item in problems}
    for problem in incoming.get("problems") or []:
        problem_id = str(problem.get("id", ""))
        if not problem_id:
            raise ValueError(f"{identity(existing)} contains a problem without an id")
        if problem_id in problem_ids:
            # Shard prompts may repeat a document-level preface as the conventional
            # `sundry` item. Keep the first, source-backed copy instead of turning
            # the shared preface into a merge failure or duplicate page section.
            if problem_id.casefold() == "sundry":
                continue
            raise ValueError(f"{identity(existing)} contains duplicate problem id {problem_id!r}")
        problems.append(deepcopy(problem))
        problem_ids.add(problem_id)



def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", action="append", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    output = Path(args.output).expanduser().resolve()
    if ".course-build" not in output.parts:
        parser.error(f"runtime output must stay under .course-build: {output}")

    merged: dict[str, Any] = {"batch": "merged-shards", "documents": []}
    by_identity: dict[tuple[str, str], dict[str, Any]] = {}
    for raw_path in args.data:
        path = Path(raw_path).expanduser().resolve()
        payload = json.loads(path.read_text(encoding="utf-8"))
        for document in payload.get("documents") or []:
            key = identity(document)
            if not all(key):
                raise ValueError(f"invalid document identity in {path}")
            if key not in by_identity:
                clone = deepcopy(document)
                by_identity[key] = clone
                merged["documents"].append(clone)
            else:
                merge_documents(by_identity[key], document)

    if not merged["documents"]:
        parser.error("no documents found")
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(output.suffix + ".tmp")
    temporary.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(output)
    print(json.dumps({"documents": len(merged["documents"]), "output": str(output)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
