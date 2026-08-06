#!/usr/bin/env python3
"""Inventory a local course-resource folder and extract searchable text."""

from __future__ import annotations

import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import zipfile


PLAIN_EXTENSIONS = {
    ".txt", ".md", ".rst", ".csv", ".tsv", ".json", ".yaml", ".yml",
    ".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".java",
    ".c", ".cc", ".cpp", ".h", ".hpp", ".cu", ".rs", ".go", ".sh",
    ".bash", ".zsh", ".fish", ".sql", ".tex", ".bib", ".toml", ".ini",
}
OFFICE_EXTENSIONS = {".pptx", ".docx"}
IGNORE_DIRS = {".git", ".course-build", "node_modules", "__pycache__", ".venv", "venv"}


class TextHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.suppressed = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "noscript"}:
            self.suppressed += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self.suppressed:
            self.suppressed -= 1
        if not self.suppressed and tag in {"p", "div", "li", "tr", "h1", "h2", "h3", "br"}:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.suppressed:
            self.parts.append(data)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def classify(relative: str, suffix: str) -> str:
    name = relative.lower()
    patterns = [
        ("syllabus", r"syllabus|课程大纲|schedule|calendar"),
        ("assignment", r"assignment|homework|problem[-_ ]?set|\bhw\d*\b|作业"),
        ("lab", r"(^|[/_. -])lab\d*|实验"),
        ("project", r"project|capstone|项目"),
        ("exam", r"exam|midterm|final|quiz|考试"),
        ("lecture", r"lecture|slides?|lec[-_ ]?\d|课件|讲义"),
        ("reading", r"reading|paper|论文|教材"),
        ("starter-code", r"starter|skeleton|handout|solution|src/|code/"),
    ]
    for kind, pattern in patterns:
        if re.search(pattern, name):
            return kind
    if suffix in {".pdf", ".ppt", ".pptx", ".key"}:
        return "document"
    if suffix in PLAIN_EXTENSIONS or suffix in {".ipynb", ".html", ".htm"}:
        return "text-or-code"
    if suffix in {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}:
        return "image"
    if suffix in {".zip", ".tar", ".gz", ".tgz", ".bz2", ".7z"}:
        return "archive"
    return "other"


def extract_plain(path: Path, limit: int) -> str:
    return path.read_text(encoding="utf-8", errors="replace")[:limit]


def extract_html(path: Path, limit: int) -> str:
    parser = TextHTMLParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    text = html.unescape("".join(parser.parts))
    return re.sub(r"\n{3,}", "\n\n", text)[:limit]


def extract_notebook(path: Path, limit: int) -> str:
    data = json.loads(path.read_text(encoding="utf-8", errors="replace"))
    parts: list[str] = []
    for cell in data.get("cells", []):
        kind = cell.get("cell_type", "cell")
        source = cell.get("source", [])
        parts.append(f"\n[{kind}]\n" + "".join(source))
    return "".join(parts)[:limit]


def extract_office(path: Path, limit: int) -> str:
    parts: list[str] = []
    with zipfile.ZipFile(path) as archive:
        names = sorted(
            name for name in archive.namelist()
            if name.endswith(".xml") and (
                name.startswith("ppt/slides/slide") or
                name == "word/document.xml" or
                name.startswith("word/header") or
                name.startswith("word/footer")
            )
        )
        for name in names:
            raw = archive.read(name).decode("utf-8", errors="replace")
            texts = re.findall(r"<[^>]*:t(?:\s[^>]*)?>(.*?)</[^>]*:t>", raw, re.DOTALL)
            if texts:
                parts.append(f"\n--- {name} ---\n")
                parts.extend(html.unescape(re.sub(r"<[^>]+>", "", item)) + "\n" for item in texts)
            if sum(len(part) for part in parts) >= limit:
                break
    return "".join(parts)[:limit]


def extract_pdf(path: Path, limit: int) -> tuple[str, str | None]:
    command = shutil.which("pdftotext")
    if command:
        completed = subprocess.run(
            [command, "-layout", str(path), "-"],
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        if completed.returncode == 0:
            return completed.stdout.decode("utf-8", errors="replace")[:limit], None
        command_error = completed.stderr.decode("utf-8", errors="replace").strip()
    else:
        command_error = "pdftotext is not installed"

    try:
        from pypdf import PdfReader  # type: ignore

        parts: list[str] = []
        for page in PdfReader(str(path)).pages:
            parts.append(page.extract_text() or "")
            if sum(len(part) for part in parts) >= limit:
                break
        text = "\n\n".join(parts)[:limit]
        if text.strip():
            return text, None
    except Exception as exc:
        pypdf_error = f"pypdf unavailable or failed: {exc}"
    else:
        pypdf_error = "pypdf returned no text"
    return "", f"{command_error}; {pypdf_error}"


def extract_text(path: Path, limit: int) -> tuple[str, str | None]:
    suffix = path.suffix.lower()
    try:
        if suffix in PLAIN_EXTENSIONS:
            return extract_plain(path, limit), None
        if suffix in {".html", ".htm"}:
            return extract_html(path, limit), None
        if suffix == ".ipynb":
            return extract_notebook(path, limit), None
        if suffix in OFFICE_EXTENSIONS:
            return extract_office(path, limit), None
        if suffix == ".pdf":
            return extract_pdf(path, limit)
    except Exception as exc:  # keep inventory useful even when one extractor fails
        return "", f"{type(exc).__name__}: {exc}"
    return "", None


def safe_extract_name(index: int, relative: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", relative).strip("._")
    return f"{index:04d}-{cleaned or 'resource'}.txt"


def iter_files(source: Path, output: Path) -> list[Path]:
    files: list[Path] = []
    for path in source.rglob("*"):
        if not path.is_file() or path.is_symlink():
            continue
        relative_parts = path.relative_to(source).parts
        if any(part in IGNORE_DIRS for part in relative_parts):
            continue
        try:
            path.relative_to(output)
            continue
        except ValueError:
            pass
        files.append(path)
    return sorted(files, key=lambda item: item.relative_to(source).as_posix().lower())


def write_markdown(output: Path, source: Path, entries: list[dict]) -> None:
    counts: dict[str, int] = {}
    for entry in entries:
        counts[entry["kind"]] = counts.get(entry["kind"], 0) + 1
    lines = [
        "# Course resource inventory",
        "",
        f"- Source folder: `{source}`",
        f"- Files: {len(entries)}",
        f"- Extracted text files: {sum(bool(item.get('extractedText')) for item in entries)}",
        "",
        "## Counts by kind",
        "",
    ]
    for kind, count in sorted(counts.items()):
        lines.append(f"- {kind}: {count}")
    lines.extend(["", "## Resources", ""])
    for entry in entries:
        detail = f"{entry['bytes']} bytes, `{entry['sha256'][:12]}`"
        lines.append(f"- **{entry['kind']}** `{entry['path']}` — {detail}")
        if entry.get("extractedText"):
            lines.append(f"  - extracted: `{entry['extractedText']}`")
        if entry.get("extractionError"):
            lines.append(f"  - extraction warning: {entry['extractionError']}")
    (output / "inventory.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", default=".", help="Course resource folder")
    parser.add_argument("--output", default=".course-build", help="Inventory output folder")
    parser.add_argument("--max-text-bytes", type=int, default=2_000_000)
    args = parser.parse_args()

    source = Path(args.source).expanduser().resolve()
    output = Path(args.output).expanduser().resolve()
    if not source.is_dir():
        parser.error(f"source is not a directory: {source}")
    output.mkdir(parents=True, exist_ok=True)
    extracted_dir = output / "extracted"
    extracted_dir.mkdir(parents=True, exist_ok=True)

    entries: list[dict] = []
    for index, path in enumerate(iter_files(source, output), start=1):
        relative = path.relative_to(source).as_posix()
        suffix = path.suffix.lower()
        text, error = extract_text(path, args.max_text_bytes)
        entry = {
            "path": relative,
            "suffix": suffix,
            "kind": classify(relative, suffix),
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
            "extractedText": None,
            "extractionError": error,
        }
        if text.strip():
            extract_name = safe_extract_name(index, relative)
            (extracted_dir / extract_name).write_text(text, encoding="utf-8")
            entry["extractedText"] = f"extracted/{extract_name}"
        entries.append(entry)

    payload = {"source": str(source), "files": entries}
    (output / "inventory.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    write_markdown(output, source, entries)
    print(json.dumps({"files": len(entries), "output": str(output)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
