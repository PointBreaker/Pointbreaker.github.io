#!/usr/bin/env python3
"""Normalize dollar-delimited math in structured extraction JSON before rendering."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
from typing import Any


DISPLAY_MATH = re.compile(r"(?<!\\)\$\$(.+?)(?<!\\)\$\$", re.DOTALL)
INLINE_MATH = re.compile(r"(?<!\\)\$(?!\$)([^\n$]+?)(?<!\\)\$(?!\$)")
UNESCAPED_DOLLAR = re.compile(r"(?<!\\)\$")
CURRENCY_DOLLAR = re.compile(
    r"(?<!\\)\$(?=\d+(?:[.,]\d+)?(?:\s*(?:元|美元|和|的|，|。|；|、)|/(?:盒|件)|$))"
)
PROTECTED_CODE = re.compile(r"(```[\s\S]*?```|`[^`\n]*`)")


def normalize_prose(value: str) -> str:
    normalized = CURRENCY_DOLLAR.sub(r"\\$", value)
    normalized = DISPLAY_MATH.sub(lambda match: r"\[" + match.group(1).strip() + r"\]", normalized)
    normalized = INLINE_MATH.sub(lambda match: r"\(" + match.group(1).strip() + r"\)", normalized)
    if UNESCAPED_DOLLAR.search(normalized):
        raise ValueError(f"unpaired dollar delimiter remains near: {normalized[:180]!r}")
    if normalized.count(r"\(") != normalized.count(r"\)"):
        raise ValueError(f"unbalanced inline math delimiters near: {normalized[:180]!r}")
    if normalized.count(r"\[") != normalized.count(r"\]"):
        raise ValueError(f"unbalanced display math delimiters near: {normalized[:180]!r}")
    return normalized


def normalize_string(value: str) -> str:
    parts = PROTECTED_CODE.split(value)
    return "".join(part if PROTECTED_CODE.fullmatch(part) else normalize_prose(part) for part in parts)


def normalize(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: normalize(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize(item) for item in value]
    if isinstance(value, str):
        return normalize_string(value)
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    source = Path(args.input).expanduser().resolve()
    output = Path(args.output).expanduser().resolve()
    if not source.is_file():
        parser.error(f"missing input: {source}")
    if ".course-build" not in output.parts:
        parser.error(f"runtime output must stay under .course-build: {output}")

    payload = normalize(json.loads(source.read_text(encoding="utf-8")))
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(output.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(output)
    print(json.dumps({"input": str(source), "output": str(output)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
