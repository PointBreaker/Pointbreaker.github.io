#!/usr/bin/env python3
"""Validate CourseStack Interactive v1 specs and their static fallbacks."""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
import json
import math
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


COURSES_ROOT = "courses"
ALLOWED_KINDS = {"function-plot", "matrix-heatmap", "stepper"}
ALLOWED_FUNCTIONS = {
    "abs", "acos", "asin", "atan", "ceil", "cos", "exp", "floor",
    "log", "log10", "max", "min", "pow", "round", "sin", "sqrt", "tan",
}
CONSTANTS = {"e", "pi", "x"}
ID_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
EXPRESSION_RE = re.compile(r"^[0-9A-Za-z_+\-*/^().,\s]+$")
TOKEN_RE = re.compile(r"\s*(?:(\d*\.?\d+(?:e[+-]?\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|([()+\-*/^,]))", re.IGNORECASE)
DRIVE_RE = re.compile(r"https?://(?:drive|docs)\.google\.com", re.IGNORECASE)
MAX_SPEC_BYTES = 256_000
MAX_FALLBACK_BYTES = 2_000_000


class InteractiveHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.stack: list[str] = []
        self.active: list[dict] = []
        self.records: list[dict] = []

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {key: value or "" for key, value in attrs_list}
        classes = set(attrs.get("class", "").split())
        if "course-interactive" in classes:
            record = {
                "tag": tag,
                "depth": len(self.stack),
                "src": attrs.get("data-interactive-src", ""),
                "fallbacks": [],
            }
            self.records.append(record)
            self.active.append(record)
        if tag == "img" and "course-interactive-fallback" in classes:
            for record in self.active:
                record["fallbacks"].append({"src": attrs.get("src", ""), "alt": attrs.get("alt", "")})
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}:
            self.stack.append(tag)

    def handle_startendtag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs_list)
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()

    def handle_endtag(self, tag: str) -> None:
        closing_depth = len(self.stack) - 1
        self.active = [record for record in self.active if not (record["tag"] == tag and record["depth"] == closing_depth)]
        if self.stack:
            self.stack.pop()


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def finite_number(value: object) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def local_target(base: Path, value: str, boundary: Path) -> tuple[Path | None, str | None]:
    if not value:
        return None, "missing local path"
    split = urlsplit(value)
    if split.scheme or split.netloc or value.startswith("/"):
        return None, f"must use a relative local path: {value}"
    target = (base / unquote(split.path)).resolve()
    try:
        target.relative_to(boundary.resolve())
    except ValueError:
        return None, f"path escapes course directory: {value}"
    if not target.is_file():
        return None, f"missing file: {value}"
    return target, None


def validate_domain(value: object, label: str, errors: list[str]) -> None:
    if not isinstance(value, list) or len(value) != 2 or not all(finite_number(item) for item in value):
        errors.append(f"{label} must contain two finite numbers")
    elif value[0] >= value[1]:
        errors.append(f"{label} minimum must be smaller than maximum")


class ExpressionSyntaxError(ValueError):
    pass


class ExpressionParser:
    def __init__(self, expression: str, allowed_names: set[str]) -> None:
        self.tokens: list[tuple[str, str]] = []
        self.position = 0
        self.allowed_names = allowed_names
        index = 0
        while index < len(expression):
            match = TOKEN_RE.match(expression, index)
            if not match:
                if expression[index:].strip():
                    raise ExpressionSyntaxError(f"unsupported token near {expression[index:index + 12]}")
                break
            number, name, symbol = match.groups()
            if number is not None:
                self.tokens.append(("number", number))
            elif name is not None:
                self.tokens.append(("name", name))
            else:
                self.tokens.append((symbol, symbol))
            index = match.end()
            if len(self.tokens) > 160:
                raise ExpressionSyntaxError("expression is too complex")

    def peek(self, token_type: str) -> bool:
        return self.position < len(self.tokens) and self.tokens[self.position][0] == token_type

    def take(self, token_type: str) -> tuple[str, str]:
        if not self.peek(token_type):
            raise ExpressionSyntaxError(f"expected {token_type}")
        token = self.tokens[self.position]
        self.position += 1
        return token

    def parse(self) -> None:
        self.parse_expression()
        if self.position != len(self.tokens):
            raise ExpressionSyntaxError("unexpected expression suffix")

    def parse_primary(self) -> None:
        if self.peek("number"):
            self.take("number")
            return
        if self.peek("name"):
            name = self.take("name")[1]
            if self.peek("("):
                self.take("(")
                argument_count = 0
                if not self.peek(")"):
                    self.parse_expression()
                    argument_count = 1
                    while self.peek(","):
                        self.take(",")
                        self.parse_expression()
                        argument_count += 1
                self.take(")")
                if name not in ALLOWED_FUNCTIONS:
                    raise ExpressionSyntaxError(f"unsupported function {name}")
                if name == "pow" and argument_count != 2:
                    raise ExpressionSyntaxError("pow requires exactly two arguments")
                if name in {"min", "max"} and argument_count < 1:
                    raise ExpressionSyntaxError(f"{name} requires at least one argument")
                if name not in {"pow", "min", "max"} and argument_count != 1:
                    raise ExpressionSyntaxError(f"{name} requires exactly one argument")
                return
            if name not in self.allowed_names and name not in {"pi", "e"}:
                raise ExpressionSyntaxError(f"unknown variable {name}")
            return
        if self.peek("("):
            self.take("(")
            self.parse_expression()
            self.take(")")
            return
        raise ExpressionSyntaxError("expected a number, variable, or parenthesized expression")

    def parse_power(self) -> None:
        self.parse_primary()
        if self.peek("^"):
            self.take("^")
            self.parse_unary()

    def parse_unary(self) -> None:
        if self.peek("+") or self.peek("-"):
            self.position += 1
            self.parse_unary()
            return
        self.parse_power()

    def parse_term(self) -> None:
        self.parse_unary()
        while self.peek("*") or self.peek("/"):
            self.position += 1
            self.parse_unary()

    def parse_expression(self) -> None:
        self.parse_term()
        while self.peek("+") or self.peek("-"):
            self.position += 1
            self.parse_term()


def validate_expression(expression: object, allowed_names: set[str], label: str, errors: list[str]) -> None:
    if not isinstance(expression, str) or not expression.strip() or len(expression) > 180:
        errors.append(f"{label} must be a non-empty expression of at most 180 characters")
        return
    if not EXPRESSION_RE.fullmatch(expression):
        errors.append(f"{label} contains unsupported characters")
        return
    try:
        ExpressionParser(expression, allowed_names).parse()
    except ExpressionSyntaxError as exc:
        errors.append(f"{label} is invalid: {exc}")


def validate_function_plot(spec: dict, label: str, errors: list[str]) -> None:
    validate_domain(spec.get("xDomain"), f"{label}: xDomain", errors)
    if "yDomain" in spec:
        validate_domain(spec.get("yDomain"), f"{label}: yDomain", errors)
    samples = spec.get("samples", 240)
    if not isinstance(samples, int) or not 64 <= samples <= 600:
        errors.append(f"{label}: samples must be an integer from 64 to 600")
    parameters = spec.get("parameters", [])
    if not isinstance(parameters, list) or len(parameters) > 8:
        errors.append(f"{label}: parameters must be a list with at most 8 entries")
        parameters = []
    parameter_ids: set[str] = set()
    for index, parameter in enumerate(parameters, start=1):
        prefix = f"{label}: parameter {index}"
        if not isinstance(parameter, dict):
            errors.append(f"{prefix} must be an object")
            continue
        parameter_id = parameter.get("id")
        if not isinstance(parameter_id, str) or not ID_RE.fullmatch(parameter_id):
            errors.append(f"{prefix} has an invalid id")
            continue
        if parameter_id in parameter_ids or parameter_id in CONSTANTS or parameter_id in ALLOWED_FUNCTIONS:
            errors.append(f"{prefix} id is duplicated or reserved: {parameter_id}")
        parameter_ids.add(parameter_id)
        minimum, maximum, value, step = (parameter.get(key) for key in ("min", "max", "value", "step"))
        if not all(finite_number(item) for item in (minimum, maximum, value, step)):
            errors.append(f"{prefix} min, max, value, and step must be finite numbers")
        elif minimum >= maximum or not minimum <= value <= maximum or step <= 0:
            errors.append(f"{prefix} has an invalid range, value, or step")
    series = spec.get("series")
    if not isinstance(series, list) or not 1 <= len(series) <= 6:
        errors.append(f"{label}: series must contain 1 to 6 entries")
        return
    allowed_names = {"x", *parameter_ids}
    for index, item in enumerate(series, start=1):
        if not isinstance(item, dict):
            errors.append(f"{label}: series {index} must be an object")
            continue
        validate_expression(item.get("expression"), allowed_names, f"{label}: series {index} expression", errors)
        if not item.get("label"):
            errors.append(f"{label}: series {index} requires a label")


def matrix_shape(values: object) -> tuple[int, int] | None:
    if not isinstance(values, list) or not values or not all(isinstance(row, list) and row for row in values):
        return None
    columns = len(values[0])
    if any(len(row) != columns for row in values):
        return None
    if any(not finite_number(value) for row in values for value in row):
        return None
    return len(values), columns


def validate_matrix(spec: dict, label: str, errors: list[str]) -> None:
    frames = spec.get("frames")
    if frames is None:
        frames = [{"label": spec.get("title"), "values": spec.get("values")}]
    if not isinstance(frames, list) or not 1 <= len(frames) <= 32:
        errors.append(f"{label}: frames must contain 1 to 32 entries")
        return
    expected_shape = None
    for index, frame in enumerate(frames, start=1):
        if not isinstance(frame, dict):
            errors.append(f"{label}: frame {index} must be an object")
            continue
        shape = matrix_shape(frame.get("values"))
        if not shape:
            errors.append(f"{label}: frame {index} must contain a rectangular finite numeric matrix")
            continue
        if shape[0] * shape[1] > 4096:
            errors.append(f"{label}: frame {index} exceeds 4096 cells")
        if expected_shape and shape != expected_shape:
            errors.append(f"{label}: all frames must use the same matrix shape")
        expected_shape = expected_shape or shape
    if expected_shape:
        rows, columns = expected_shape
        if "rowLabels" in spec and len(spec.get("rowLabels", [])) != rows:
            errors.append(f"{label}: rowLabels length must match matrix rows")
        if "columnLabels" in spec and len(spec.get("columnLabels", [])) != columns:
            errors.append(f"{label}: columnLabels length must match matrix columns")
    if spec.get("colorScale", "sequential") not in {"sequential", "diverging"}:
        errors.append(f"{label}: colorScale must be sequential or diverging")
    if "valueDomain" in spec:
        validate_domain(spec.get("valueDomain"), f"{label}: valueDomain", errors)


def validate_stepper(spec: dict, spec_path: Path, course: Path, label: str, errors: list[str]) -> None:
    steps = spec.get("steps")
    if not isinstance(steps, list) or not 2 <= len(steps) <= 24:
        errors.append(f"{label}: steps must contain 2 to 24 entries")
        return
    for index, step in enumerate(steps, start=1):
        prefix = f"{label}: step {index}"
        if not isinstance(step, dict) or not step.get("title"):
            errors.append(f"{prefix} requires a title")
            continue
        if not any(step.get(key) for key in ("body", "formula", "image")):
            errors.append(f"{prefix} requires body, formula, or image content")
        if step.get("image"):
            target, error = local_target(spec_path.parent, str(step["image"]), course)
            if error:
                errors.append(f"{prefix} {error}")
            elif target and target.stat().st_size > MAX_FALLBACK_BYTES:
                errors.append(f"{prefix} image exceeds {MAX_FALLBACK_BYTES} bytes")
            if not step.get("imageAlt"):
                errors.append(f"{prefix} requires imageAlt when image is present")


def validate_spec(spec_path: Path, course: Path, label: str) -> list[str]:
    errors: list[str] = []
    if spec_path.stat().st_size > MAX_SPEC_BYTES:
        errors.append(f"{label}: spec exceeds {MAX_SPEC_BYTES} bytes")
        return errors
    try:
        spec = load_json(spec_path)
    except (OSError, json.JSONDecodeError) as exc:
        return [f"{label}: invalid JSON: {exc}"]
    if spec.get("version") != 1:
        errors.append(f"{label}: version must be 1")
    kind = spec.get("kind")
    if kind not in ALLOWED_KINDS:
        errors.append(f"{label}: kind must be one of {sorted(ALLOWED_KINDS)}")
    for key in ("title", "description", "caption"):
        if key != "caption" and not isinstance(spec.get(key), str):
            errors.append(f"{label}: {key} must be text")
    source = spec.get("source")
    if not isinstance(source, dict) or not isinstance(source.get("label"), str) or not source.get("label", "").strip():
        errors.append(f"{label}: source requires a non-empty label")
    source_url = source.get("url") if isinstance(source, dict) else ""
    if not isinstance(source_url, str) or not source_url.strip():
        errors.append(f"{label}: source requires a URL")
    elif DRIVE_RE.search(source_url):
        errors.append(f"{label}: source contains a forbidden Google Drive/Docs URL")
    else:
        split = urlsplit(source_url)
        if split.netloc and not split.scheme:
            errors.append(f"{label}: source URL must not be protocol-relative")
        elif split.scheme and split.scheme not in {"http", "https"}:
            errors.append(f"{label}: source URL must use http, https, or a relative local path")
        elif not split.scheme:
            _, source_error = local_target(spec_path.parent, source_url, course)
            if source_error:
                errors.append(f"{label}: source {source_error}")
    if kind == "function-plot":
        validate_function_plot(spec, label, errors)
    elif kind == "matrix-heatmap":
        validate_matrix(spec, label, errors)
    elif kind == "stepper":
        validate_stepper(spec, spec_path, course, label, errors)
    return errors


def validate_interactives(repo: Path, course: Path) -> tuple[list[str], dict]:
    errors: list[str] = []
    specs: set[Path] = set()
    embeds = 0
    for page in sorted(course.rglob("*.html")):
        parser = InteractiveHTMLParser()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        page_label = page.relative_to(course).as_posix()
        for record in parser.records:
            embeds += 1
            source = record["src"]
            target, error = local_target(page.parent, source, course)
            if error:
                errors.append(f"{page_label}: interactive {error}")
            elif target:
                if target.suffix.lower() != ".json":
                    errors.append(f"{page_label}: interactive spec must be JSON: {source}")
                else:
                    specs.add(target)
                    errors.extend(validate_spec(target, course, f"{page_label}: {source}"))
            fallbacks = record["fallbacks"]
            if len(fallbacks) != 1:
                errors.append(f"{page_label}: each interactive requires exactly one static fallback image")
            for fallback in fallbacks:
                if not fallback["alt"].strip():
                    errors.append(f"{page_label}: interactive fallback image requires alt text")
                fallback_target, fallback_error = local_target(page.parent, fallback["src"], course)
                if fallback_error:
                    errors.append(f"{page_label}: fallback {fallback_error}")
                elif fallback_target and fallback_target.stat().st_size > MAX_FALLBACK_BYTES:
                    errors.append(f"{page_label}: fallback image exceeds {MAX_FALLBACK_BYTES} bytes")
    return errors, {"interactiveEmbeds": embeds, "interactiveSpecs": len(specs)}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--slug", required=True)
    args = parser.parse_args()
    repo = Path(args.repo).expanduser().resolve()
    platform_path = repo / "site-platform.json"
    platform = load_json(platform_path) if platform_path.is_file() else {}
    course = repo / platform.get("coursesRoot", COURSES_ROOT) / args.slug
    if not course.is_dir():
        parser.error(f"missing course directory: {course}")
    errors, stats = validate_interactives(repo, course)
    print(json.dumps({"course": str(course), "errors": errors, "stats": stats}, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
