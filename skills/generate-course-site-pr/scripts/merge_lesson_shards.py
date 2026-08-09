#!/usr/bin/env python3
"""Merge non-overlapping thematic lesson shards without rewriting model text."""

from __future__ import annotations

import argparse
from copy import deepcopy
import json
from pathlib import Path
from typing import Any


IDENTITY_FIELDS = ("number", "titleEn", "titleZh", "ledeZh", "difficultyZh")
UNIQUE_LIST_LIMITS = {
    "sourceFiles": None,
    "objectivesZh": 6,
    "prerequisitesZh": 6,
    "misconceptions": 5,
    "recapZh": 7,
    "references": None,
}


def fingerprint(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def append_unique(target: list[Any], values: list[Any], *, field: str, limit: int | None) -> None:
    seen = {fingerprint(item) for item in target}
    for value in values:
        marker = fingerprint(value)
        if marker not in seen:
            target.append(deepcopy(value))
            seen.add(marker)
    if limit is not None and len(target) > limit:
        raise ValueError(
            f"merged {field} has {len(target)} items; thematic schema allows at most {limit}. "
            "Reduce shard overlap or shard output budgets before merging."
        )


def verify_identity(existing: dict[str, Any], incoming: dict[str, Any]) -> None:
    for field in IDENTITY_FIELDS:
        if existing.get(field) != incoming.get(field):
            raise ValueError(
                f"module {existing.get('number')} identity field {field!r} differs across shards"
            )


def append_disjoint(
    target: list[dict[str, Any]],
    values: list[dict[str, Any]],
    *,
    field: str,
    id_field: str,
    limit: int,
) -> None:
    ids = {str(item.get(id_field, "")) for item in target}
    for value in values:
        item_id = str(value.get(id_field, ""))
        if not item_id:
            raise ValueError(f"module shard contains {field} item without {id_field}")
        if item_id in ids:
            raise ValueError(f"module shard contains duplicate {field} id {item_id!r}")
        target.append(deepcopy(value))
        ids.add(item_id)
    if len(target) > limit:
        raise ValueError(
            f"merged {field} has {len(target)} items; thematic schema allows at most {limit}"
        )


def merge_module(existing: dict[str, Any], incoming: dict[str, Any]) -> None:
    verify_identity(existing, incoming)
    existing["estimatedMinutes"] = max(
        int(existing.get("estimatedMinutes", 0)), int(incoming.get("estimatedMinutes", 0))
    )
    for field, limit in UNIQUE_LIST_LIMITS.items():
        append_unique(
            existing.setdefault(field, []), incoming.get(field) or [], field=field, limit=limit
        )
    append_disjoint(
        existing.setdefault("sections", []), incoming.get("sections") or [],
        field="sections", id_field="id", limit=8,
    )
    append_disjoint(
        existing.setdefault("quizzes", []), incoming.get("quizzes") or [],
        field="quizzes", id_field="id", limit=4,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", action="append", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    output = Path(args.output).expanduser().resolve()
    if ".course-build" not in output.parts:
        parser.error(f"runtime output must stay under .course-build: {output}")

    merged: dict[str, Any] = {"modules": []}
    modules: dict[int, dict[str, Any]] = {}
    for raw_path in args.data:
        path = Path(raw_path).expanduser().resolve()
        payload = json.loads(path.read_text(encoding="utf-8"))
        for module in payload.get("modules") or []:
            number = module.get("number")
            if not isinstance(number, int) or number < 1:
                raise ValueError(f"invalid module number in {path}: {number!r}")
            if number not in modules:
                clone = deepcopy(module)
                modules[number] = clone
                merged["modules"].append(clone)
            else:
                merge_module(modules[number], module)

    if not merged["modules"]:
        parser.error("no modules found")
    merged["modules"].sort(key=lambda item: item["number"])
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(output.suffix + ".tmp")
    temporary.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(output)
    print(json.dumps({"modules": len(merged["modules"]), "output": str(output)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
