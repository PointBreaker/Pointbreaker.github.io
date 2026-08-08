#!/usr/bin/env python3
"""Run a verified, read-only LongCat extraction and capture structured output."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
from typing import Any


DEFAULT_MODEL = "LongCat-2.0[1M]"
ALLOWED_CANONICAL_MODELS = {"longcat-2.0", "longcat-2.0[1m]"}
EXPECTED_PROVIDER = "firstParty"
EXPECTED_CONTEXT_WINDOW = 1_000_000


def verify_claude_cli(command: str) -> str:
    resolved = shutil.which(command)
    if not resolved:
        raise RuntimeError(f"Claude CLI was not found: {command}")
    try:
        completed = subprocess.run(
            [resolved, "--help"],
            check=False,
            capture_output=True,
            text=True,
            timeout=30,
        )
    except subprocess.TimeoutExpired as error:
        raise RuntimeError("Claude CLI help check timed out") from error
    help_text = f"{completed.stdout}\n{completed.stderr}"
    required_flags = ("--model", "--output-format", "--json-schema")
    missing = [flag for flag in required_flags if flag not in help_text]
    if completed.returncode != 0:
        raise RuntimeError(f"Claude CLI help check failed with exit {completed.returncode}")
    if missing:
        raise RuntimeError(
            "Claude CLI does not expose the required structured-output flags: "
            + ", ".join(missing)
        )
    return resolved


def parse_cli_json(stdout: str) -> dict[str, Any]:
    candidates = [line.strip() for line in stdout.splitlines() if line.strip()]
    for candidate in reversed(candidates):
        try:
            value = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(value, dict) and "modelUsage" in value:
            return value
    raise ValueError("Claude CLI did not return a machine-readable result object")


def verified_model_usage(payload: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    model_usage = payload.get("modelUsage") or {}
    if not isinstance(model_usage, dict) or len(model_usage) != 1:
        raise ValueError(f"expected exactly one modelUsage entry, got {list(model_usage)}")
    label, usage = next(iter(model_usage.items()))
    if not isinstance(usage, dict):
        raise ValueError("invalid modelUsage payload")
    canonical = str(usage.get("canonicalModel", "")).lower()
    provider = usage.get("provider")
    context_window = usage.get("contextWindow")
    if canonical not in ALLOWED_CANONICAL_MODELS:
        raise ValueError(f"unexpected canonical model: {canonical!r}")
    if provider != EXPECTED_PROVIDER:
        raise ValueError(f"unexpected provider: {provider!r}")
    if context_window != EXPECTED_CONTEXT_WINDOW:
        raise ValueError(f"unexpected context window: {context_window!r}")
    return label, usage


def run_claude(
    *,
    claude: str,
    model: str,
    prompt: str,
    schema: dict[str, Any],
    workdir: Path,
    add_dirs: list[Path],
    tools: str,
    max_budget_usd: float | None,
    timeout_seconds: int,
) -> dict[str, Any]:
    command = [
        claude,
        "--print",
        "--no-session-persistence",
        "--permission-mode",
        "dontAsk",
        "--no-chrome",
        "--disable-slash-commands",
        "--tools",
        tools,
        "--model",
        model,
        "--autocompact",
        "1M",
        "--output-format",
        "json",
        "--json-schema",
        json.dumps(schema, ensure_ascii=False, separators=(",", ":")),
    ]
    if add_dirs:
        command.extend(["--add-dir", *[str(path) for path in add_dirs]])
    if max_budget_usd is not None:
        command.extend(["--max-budget-usd", str(max_budget_usd)])
    command.append(prompt)
    try:
        completed = subprocess.run(
            command,
            cwd=workdir,
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
        )
    except subprocess.TimeoutExpired as error:
        raise RuntimeError(f"Claude CLI timed out after {timeout_seconds} seconds") from error
    if completed.returncode != 0:
        message = completed.stderr.strip() or completed.stdout.strip()
        raise RuntimeError(f"Claude CLI failed with exit {completed.returncode}: {message}")
    return parse_cli_json(completed.stdout)


def structured_output(payload: dict[str, Any]) -> Any:
    if payload.get("structured_output") is not None:
        return payload["structured_output"]
    result = payload.get("result")
    if not isinstance(result, str):
        raise ValueError("Claude CLI result has no structured output")
    return json.loads(result)


def atomic_json_write(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary.replace(path)


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prompt-file", required=True)
    parser.add_argument("--schema-file", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--run-json", required=True)
    parser.add_argument("--workdir", required=True)
    parser.add_argument("--add-dir", action="append", default=[])
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--claude", default="claude")
    parser.add_argument("--max-budget-usd", type=float)
    parser.add_argument("--timeout-seconds", type=int, default=900)
    args = parser.parse_args()

    prompt_path = Path(args.prompt_file).expanduser().resolve()
    schema_path = Path(args.schema_file).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()
    run_path = Path(args.run_json).expanduser().resolve()
    workdir = Path(args.workdir).expanduser().resolve()
    add_dirs = [Path(path).expanduser().resolve() for path in args.add_dir]

    for path in [prompt_path, schema_path]:
        if not path.is_file():
            parser.error(f"missing input file: {path}")
    if not workdir.is_dir():
        parser.error(f"missing workdir: {workdir}")
    for path in add_dirs:
        if not path.exists():
            parser.error(f"missing add-dir: {path}")
    for path in [output_path, run_path]:
        if ".course-build" not in path.parts:
            parser.error(f"runtime output must stay under .course-build: {path}")

    prompt = prompt_path.read_text(encoding="utf-8")
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    started_at = datetime.now(timezone.utc).isoformat()
    claude = verify_claude_cli(args.claude)

    probe_schema = {
        "type": "object",
        "properties": {"ok": {"type": "boolean"}},
        "required": ["ok"],
        "additionalProperties": False,
    }
    probe = run_claude(
        claude=claude,
        model=args.model,
        prompt="Return JSON with ok=true. Do not use tools.",
        schema=probe_schema,
        workdir=workdir,
        add_dirs=[],
        tools="",
        max_budget_usd=0.10,
        timeout_seconds=min(args.timeout_seconds, 360),
    )
    probe_label, probe_usage = verified_model_usage(probe)
    if structured_output(probe) != {"ok": True}:
        raise ValueError("LongCat preflight returned unexpected structured output")

    extraction = run_claude(
        claude=claude,
        model=args.model,
        prompt=prompt,
        schema=schema,
        workdir=workdir,
        add_dirs=add_dirs,
        tools="Read",
        max_budget_usd=args.max_budget_usd,
        timeout_seconds=args.timeout_seconds,
    )
    extraction_label, extraction_usage = verified_model_usage(extraction)
    if extraction_label != probe_label:
        raise ValueError(
            f"model label changed after preflight: {probe_label!r} -> {extraction_label!r}"
        )
    server_tool_use = (extraction.get("usage") or {}).get("server_tool_use", {})
    if server_tool_use.get("web_search_requests", 0) or server_tool_use.get("web_fetch_requests", 0):
        raise ValueError("Claude extraction unexpectedly used network-backed search or fetch")

    result = structured_output(extraction)
    atomic_json_write(output_path, result)
    run_record = {
        "startedAt": started_at,
        "completedAt": datetime.now(timezone.utc).isoformat(),
        "modelRequested": args.model,
        "modelLabel": extraction_label,
        "canonicalModel": extraction_usage.get("canonicalModel"),
        "provider": extraction_usage.get("provider"),
        "contextWindow": extraction_usage.get("contextWindow"),
        "promptFile": str(prompt_path),
        "promptSha256": sha256_text(prompt),
        "schemaFile": str(schema_path),
        "schemaSha256": sha256_text(json.dumps(schema, sort_keys=True)),
        "workdir": str(workdir),
        "readDirectories": [str(path) for path in add_dirs],
        "output": str(output_path),
        "preflightUsage": probe.get("usage"),
        "extractionUsage": extraction.get("usage"),
        "modelUsage": extraction.get("modelUsage"),
        "durationMs": extraction.get("duration_ms"),
        "costUsd": extraction.get("total_cost_usd"),
        "webSearchRequests": server_tool_use.get("web_search_requests", 0),
        "webFetchRequests": server_tool_use.get("web_fetch_requests", 0),
        "permissionDenials": extraction.get("permission_denials", []),
    }
    atomic_json_write(run_path, run_record)
    print(
        json.dumps(
            {
                "status": "ok",
                "model": extraction_label,
                "canonicalModel": extraction_usage.get("canonicalModel"),
                "provider": extraction_usage.get("provider"),
                "contextWindow": extraction_usage.get("contextWindow"),
                "inputTokens": (extraction.get("usage") or {}).get("input_tokens"),
                "outputTokens": (extraction.get("usage") or {}).get("output_tokens"),
                "costUsd": extraction.get("total_cost_usd"),
                "output": str(output_path),
                "runJson": str(run_path),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(json.dumps({"status": "error", "message": str(error)}, ensure_ascii=False))
        raise SystemExit(1)
