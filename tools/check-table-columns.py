#!/usr/bin/env python3
"""Fail when a published HTML table renders an entirely empty grid column."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from bs4 import BeautifulSoup, Tag


@dataclass
class Cell:
    text: str
    source: Tag


def positive_int(value: object, default: int = 1) -> int:
    try:
        number = int(str(value))
    except (TypeError, ValueError):
        return default
    return max(1, number)


def table_grid(table: Tag) -> list[list[Cell | None]]:
    rows: list[list[Cell | None]] = []
    spans: dict[tuple[int, int], Cell] = {}
    source_rows = table.find_all("tr")

    for row_index, row in enumerate(source_rows):
        grid_row: list[Cell | None] = []
        column = 0

        def fill_spans() -> None:
            nonlocal column
            while (row_index, column) in spans:
                grid_row.append(spans[(row_index, column)])
                column += 1

        fill_spans()
        for node in row.find_all(["th", "td"], recursive=False):
            fill_spans()
            rowspan = positive_int(node.get("rowspan"))
            colspan = positive_int(node.get("colspan"))
            cell = Cell(" ".join(node.stripped_strings), node)
            for offset in range(colspan):
                grid_row.append(cell)
                if rowspan > 1:
                    for future_row in range(row_index + 1, row_index + rowspan):
                        spans[(future_row, column + offset)] = cell
            column += colspan
        fill_spans()
        rows.append(grid_row)

    width = max((len(row) for row in rows), default=0)
    return [row + [None] * (width - len(row)) for row in rows]


def find_empty_columns(path: Path) -> list[str]:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    findings: list[str] = []
    for index, table in enumerate(soup.find_all("table"), start=1):
        grid = table_grid(table)
        if not grid or not grid[0]:
            continue
        empty = [
            column + 1
            for column in range(len(grid[0]))
            if all(cell is None or not cell.text.strip() for cell in (row[column] for row in grid))
        ]
        if empty:
            label = table.get("class") or table.get("id") or f"table-{index}"
            findings.append(f"{path}: {label} has entirely empty rendered column(s): {empty}")
    return findings


def check_shared_table_shell(root: Path) -> list[str]:
    css_path = root / "assets/course/lesson.css"
    js_path = root / "assets/course/lesson-ui.js"
    if not css_path.is_file() or not js_path.is_file():
        return ["shared lesson table assets are missing"]
    css = css_path.read_text(encoding="utf-8")
    javascript = js_path.read_text(encoding="utf-8")
    findings: list[str] = []
    if ".pb-table-scroll" not in css or "overflow-x: auto" not in css:
        findings.append("shared table scroll container is missing from lesson.css")
    compact_css = "".join(css.split())
    if ".pb-table-scroll{box-sizing:border-box;width:fit-content;max-width:100%" not in compact_css:
        findings.append("table scroll container must shrink to its table instead of leaving a trailing blank area")
    if "min-width:100%" in compact_css.partition(".pb-table-scrolltable{")[2].partition("}")[0]:
        findings.append("shared table styles must not stretch narrow tables to the full lesson width")
    if "pb-table-scroll" not in javascript or "appendChild(table)" not in javascript:
        findings.append("lesson-ui.js does not wrap tables in the shared scroll container")
    return findings


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", nargs="?", default=".")
    args = parser.parse_args()
    root = Path(args.root)
    findings = check_shared_table_shell(root)
    for path in sorted(root.rglob("*.html")):
        if ".git" not in path.parts:
            findings.extend(find_empty_columns(path))
    if findings:
        print("\n".join(findings))
        return 1
    print("TABLE_COLUMNS_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
