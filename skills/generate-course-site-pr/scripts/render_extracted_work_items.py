#!/usr/bin/env python3
"""Render structured discussion/homework extraction into CourseStack pages."""

from __future__ import annotations

import argparse
from copy import deepcopy
import html
import json
from pathlib import Path
import re
import sys
import unicodedata

from bs4 import BeautifulSoup
import markdown


START_MARKER = "<!-- COMPLETE_SOURCE_OUTLINE_START -->"
END_MARKER = "<!-- COMPLETE_SOURCE_OUTLINE_END -->"
FORBIDDEN = ("drive.google.com", "docs.google.com", "<script", "<iframe", "javascript:")
ALLOWED_TAGS = {
    "p", "ul", "ol", "li", "strong", "em", "code", "pre", "blockquote",
    "table", "thead", "tbody", "tr", "th", "td", "h3", "h4", "hr", "br",
}


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")
    return slug or "practice"


def protect_math(value: str) -> tuple[str, dict[str, str]]:
    replacements: dict[str, str] = {}
    pattern = re.compile(r"\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]")

    def replace(match: re.Match[str]) -> str:
        token = f"COURSESTACKMATH{len(replacements)}TOKEN"
        replacements[token] = html.escape(match.group(0), quote=False)
        return token

    return pattern.sub(replace, value), replacements


def render_markdown(value: str) -> str:
    if not value.strip():
        return ""
    lowered = value.lower()
    if any(fragment in lowered for fragment in FORBIDDEN):
        raise ValueError("forbidden URL or executable markup in extracted Markdown")
    protected, replacements = protect_math(value)
    rendered = markdown.markdown(
        protected,
        extensions=["fenced_code", "tables", "sane_lists"],
        output_format="html5",
    )
    soup = BeautifulSoup(rendered, "html.parser")
    for tag in list(soup.find_all(True)):
        if tag.name not in ALLOWED_TAGS:
            tag.unwrap()
            continue
        allowed_attributes: dict[str, str] = {}
        if tag.name == "code":
            classes = [item for item in tag.get("class", []) if re.fullmatch(r"language-[a-z0-9_-]+", item)]
            if classes:
                allowed_attributes["class"] = " ".join(classes)
        if tag.name in {"th", "td"}:
            for attribute in ("colspan", "rowspan"):
                if tag.get(attribute) and str(tag[attribute]).isdigit():
                    allowed_attributes[attribute] = str(tag[attribute])
        tag.attrs = allowed_attributes
    result = str(soup)
    for token, math_value in replacements.items():
        result = result.replace(token, math_value)
    return result


def evidence_label(evidence: dict | None) -> str:
    if not evidence:
        return ""
    source = html.escape(str(evidence.get("sourceFile", "")))
    page = html.escape(str(evidence.get("pageOrSlide", "")))
    confidence = html.escape(str(evidence.get("confidence", "")))
    location = f" · {page}" if page else ""
    return f"<code>{source}</code>{location} · confidence: {confidence}"


def visual_markup(requirements: list[dict]) -> str:
    useful = [item for item in requirements if item.get("kind") != "none"]
    if not useful:
        return ""
    rows = []
    for item in useful:
        description = html.escape(str(item.get("descriptionZh", "")))
        source = html.escape(str(item.get("sourceFile", "")))
        page = html.escape(str(item.get("pageOrSlide", "")))
        data = render_markdown(str(item.get("requiredDataMarkdown", "")))
        rows.append(
            '<section class="problem-subsection problem-visual-note">'
            f"<h4>图表条件 · {description}</h4>{data}"
            f'<p class="problem-source">来源：<code>{source}</code>{f" · {page}" if page else ""}</p>'
            "</section>"
        )
    return "".join(rows)


def problem_markup(problem: dict, index: int) -> str:
    identifier = html.escape(str(problem.get("id") or f"Q{index}"))
    title = html.escape(str(problem.get("titleZh") or identifier))
    statement = render_markdown(str(problem.get("statementMarkdown", "")))
    hint = render_markdown(str(problem.get("hintMarkdown", "")))
    solution = render_markdown(str(problem.get("solutionMarkdown", "")))
    official = problem.get("solutionStatus") == "official"
    badges = ["<span>官方题面翻译</span>", '<span class="offline-ready">可离线作答</span>']
    badges.append("<span>官方解答已收录</span>" if official else "<span>无本地官方解答</span>")
    hint_markup = ""
    if hint:
        hint_markup = (
            '<details class="problem-disclosure hint-disclosure">'
            "<summary>查看解题提示</summary>"
            f'<div class="problem-disclosure-body">{hint}</div>'
            "</details>"
        )
    if official:
        solution_markup = (
            '<details class="problem-disclosure solution-disclosure">'
            "<summary>展开官方参考解答</summary>"
            f'<div class="problem-disclosure-body">{solution}</div>'
            f'<p class="problem-source">解答来源：{evidence_label(problem.get("solutionEvidence"))}</p>'
            "</details>"
        )
    else:
        solution_markup = (
            '<div class="problem-method"><strong>答案状态</strong>'
            "<p>本地资料未提供这道题的官方解答；页面只保留题面与非答案式提示。</p></div>"
        )
    return (
        '<details class="problem-row">'
        "<summary>"
        f'<span class="problem-number">{identifier}</span>'
        f"<strong>{title}</strong>"
        '<span class="problem-topics">题目 · 提示 · 答案</span>'
        "</summary>"
        '<div class="problem-body">'
        f'<div class="problem-badges">{"".join(badges)}</div>'
        f'<section class="problem-subsection"><h4>完整题面</h4>{statement}</section>'
        f"{visual_markup(problem.get('visualRequirements') or [])}"
        f"{hint_markup}{solution_markup}"
        f'<p class="problem-source-note">题面来源：{evidence_label(problem.get("questionEvidence"))}</p>'
        "</div></details>"
    )


def outline_markup(document: dict) -> str:
    kind = html.escape(str(document["kind"]))
    count = len(document.get("problems") or [])
    source_files = list(dict.fromkeys(document.get("sourceFiles", []) + document.get("solutionSourceFiles", [])))
    sources = "、".join(f"<code>{html.escape(path)}</code>" for path in source_files)
    problem_rows = "".join(
        problem_markup(problem, index)
        for index, problem in enumerate(document.get("problems") or [], 1)
    )
    official_count = sum(
        problem.get("solutionStatus") == "official"
        for problem in document.get("problems") or []
    )
    if official_count == count and count:
        solution_note = "本地官方解答已完整收录并默认折叠；建议先独立完成，再逐题核对推导。"
    elif official_count:
        solution_note = (
            f"本地官方解答已收录 {official_count}/{count} 道并默认折叠；"
            "其余题目会明确标注无本地官方解答。"
        )
    else:
        solution_note = "本地资料未包含官方解答；提示只用于指出切入点。"
    return (
        f"{START_MARKER}\n"
        '<section class="source-outline" id="complete-source-outline">'
        f'<p class="eyebrow">Complete local extraction · {kind}</p>'
        '<h2 id="complete-problems">完整题目、提示与答案</h2>'
        f'<p class="source-outline-intro">本节按本地一手资料完整整理，共 {count} 道大题。{solution_note}</p>'
        '<div class="source-outline-notes"><h3>使用说明</h3><ul>'
        '<li>所有题面均已本土化，并补足网页离线作答所需的数值、代码、表格与约束。</li>'
        '<li>题目与答案分层展示，展开答案前可先查看提示。</li>'
        f"<li>本地来源：{sources}</li>"
        "</ul></div>"
        f'<div class="problem-outline">{problem_rows}</div>'
        "</section>\n"
        f"{END_MARKER}"
    )


def replace_or_insert_outline(page: str, outline: str) -> str:
    if START_MARKER in page and END_MARKER in page:
        pattern = re.compile(
            re.escape(START_MARKER) + r"[\s\S]*?" + re.escape(END_MARKER)
        )
        return pattern.sub(outline, page, count=1)
    anchors = [
        '<h2 id="quiz">',
        '<h2 id="logistics">',
        '<div class="nav">',
        "<footer>",
    ]
    for anchor in anchors:
        index = page.find(anchor)
        if index >= 0:
            return page[:index] + outline + "\n\n    <hr class=\"rule\">\n\n    " + page[index:]
    raise ValueError("could not find an insertion point for extracted work items")


def generated_page(course: dict, document: dict, relative_assets: str) -> str:
    code = html.escape(str(course.get("code") or course.get("courseCode") or course.get("id", "")))
    number = html.escape(str(document["number"]))
    title = html.escape(str(document.get("titleZh") or document.get("titleEn") or f"Discussion {number}"))
    summary = html.escape(str(document.get("summaryZh", "")))
    topics = " · ".join(html.escape(str(item)) for item in document.get("topicKeywords", [])[:5])
    outline = outline_markup(document)
    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{document["kind"]} {number}：{title} — {code}</title>
  <link rel="stylesheet" href="../../assets/course.css">
  <link rel="stylesheet" href="../../assets/prism.css">
  <link rel="stylesheet" href="../../assets/katex.min.css">
  <script defer src="../../assets/katex.min.js"></script>
  <script defer src="../../assets/katex-auto-render.min.js"></script>
  <script defer src="../../assets/math-render.js"></script>
  <link rel="stylesheet" href="{relative_assets}assets/course/lesson.css?v=20260808a">
  <link rel="stylesheet" href="{relative_assets}assets/course/interactive.css?v=20260806e">
</head>
<body>
  <div class="page">
    <p class="eyebrow">{code} · {document["kind"]} {number}</p>
    <h1>{title}</h1>
    <p class="lede">{summary}</p>
    <div class="meta"><span>{topics or "课程练习"}</span><span>本地资料完整提取</span></div>
    <div class="source-outline-notes"><p><strong>资料范围：</strong>题面、约束、表格与可用答案均以内置本地资料为准。</p></div>
    <hr class="rule">
    {outline}
    <footer><p>{html.escape(str(course.get("course", code)))} · {html.escape(str(course.get("term", "")))}</p></footer>
  </div>
  <script src="../../assets/prism.js"></script>
  <script src="../../assets/prism-python.js"></script>
  <script src="../../assets/prism-bash.js"></script>
  <script src="../../assets/quiz.js"></script>
  <script defer src="{relative_assets}assets/course/lesson-ui.js?v=20260806e"></script>
  <script defer src="{relative_assets}assets/course/interactive.js?v=20260806e"></script>
</body>
</html>
'''


def document_key(document: dict) -> tuple[str, str]:
    return str(document["kind"]).lower(), str(document["number"]).lower()


def item_key(item: dict) -> tuple[str, str]:
    kind = str(item.get("kind", "")).lower()
    number = item.get("displayNumber", item.get("resourceNumber", item.get("number", "")))
    title = str(item.get("title", ""))
    match = re.search(r"\b(?:HW|Homework|Discussion)\s*0*([0-9]+[a-z]?)\b", title, re.I)
    if match and "displayNumber" not in item and "resourceNumber" not in item:
        number = match.group(1)
    return kind, str(number).lower()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--data", action="append", required=True)
    args = parser.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    course_dir = repo / "courses" / args.slug
    info_path = course_dir / "course-info.json"
    info = json.loads(info_path.read_text(encoding="utf-8"))
    documents = []
    for data_path in args.data:
        payload = json.loads(Path(data_path).expanduser().resolve().read_text(encoding="utf-8"))
        documents.extend(payload.get("documents") or [])
    if not documents:
        parser.error("no extracted documents found")

    assignments = deepcopy(info.get("assignments") or [])
    existing = {item_key(item): item for item in assignments}
    next_number = max([int(item.get("number", 0)) for item in assignments] or [0]) + 1
    rendered = []

    for document in documents:
        key = document_key(document)
        if not document.get("problems"):
            raise ValueError(f"{key}: document has no problems")
        for problem in document["problems"]:
            if not str(problem.get("statementMarkdown", "")).strip():
                raise ValueError(f"{key}/{problem.get('id')}: empty problem statement")
            if (
                problem.get("solutionStatus") == "official"
                and not str(problem.get("solutionMarkdown", "")).strip()
            ):
                raise ValueError(f"{key}/{problem.get('id')}: official solution is empty")
        item = existing.get(key)
        if item is None:
            item = {
                "number": next_number,
                "kind": document["kind"],
                "displayNumber": document["number"],
                "resourceNumber": document["number"],
                "released": "",
                "due": "",
            }
            next_number += 1
            assignments.append(item)
            existing[key] = item
        item.update({
            "title": document.get("titleEn") or f'{document["kind"]} {document["number"]}',
            "titleZh": document.get("titleZh") or document.get("titleEn"),
            "description": document.get("summaryZh", ""),
            "dependsOn": document.get("suggestedDependsOn") or item.get("dependsOn") or [],
            "sourceFiles": list(dict.fromkeys(document.get("sourceFiles", []) + document.get("solutionSourceFiles", []))),
            "problemCount": len(document["problems"]),
            "solutionAvailable": any(problem.get("solutionStatus") == "official" for problem in document["problems"]),
            "displayNumber": document["number"],
            "resourceNumber": document["number"],
        })

        if item.get("assGuideFile"):
            relative = item["assGuideFile"]
            page_path = course_dir / relative
            page = page_path.read_text(encoding="utf-8")
            page = replace_or_insert_outline(page, outline_markup(document))
            page_path.write_text(page, encoding="utf-8")
        else:
            number_slug = str(document["number"]).lower().zfill(2)
            if document["kind"] == "Homework":
                filename = f'hw{number_slug}-{slugify(document.get("titleEn", ""))}.html'
                relative = f"lessons/assignments/{filename}"
            else:
                filename = f'dis{number_slug}-{slugify(document.get("titleEn", ""))}.html'
                relative = f"lessons/discussions/{filename}"
            item["assGuideFile"] = relative
            page_path = course_dir / relative
            page_path.parent.mkdir(parents=True, exist_ok=True)
            page_path.write_text(generated_page(info, document, "../../../../"), encoding="utf-8")
        rendered.append(str(page_path))

    info["assignments"] = assignments
    info["workItemLabel"] = "讨论课 / 作业 / 实验"
    info_path.write_text(json.dumps(info, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"documents": len(documents), "pages": rendered, "courseInfo": str(info_path)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
