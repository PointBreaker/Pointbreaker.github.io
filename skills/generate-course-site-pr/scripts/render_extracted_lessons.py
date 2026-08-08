#!/usr/bin/env python3
"""Render structured thematic lesson extraction into scaffolded CourseStack pages."""

from __future__ import annotations

import argparse
import html
import json
from pathlib import Path
import re

from bs4 import BeautifulSoup

from render_extracted_work_items import evidence_label, render_markdown


ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def list_markup(items: list[str]) -> str:
    return "<ul>" + "".join(f"<li>{html.escape(str(item))}</li>" for item in items) + "</ul>"


def section_markup(section: dict) -> str:
    section_id = str(section["id"])
    if not ID_RE.fullmatch(section_id):
        raise ValueError(f"invalid section id: {section_id!r}")
    body = render_markdown(str(section["bodyMarkdown"]))
    example = render_markdown(str(section.get("workedExampleMarkdown", "")))
    example_markup = ""
    if example:
        example_markup = (
            '<div class="problem-method"><strong>推导示例</strong>'
            f'<div class="worked-example">{example}</div></div>'
        )
    return (
        f'<h2 id="{section_id}">{html.escape(str(section["titleZh"]))}</h2>'
        f"{body}{example_markup}"
    )


def quiz_markup(quiz: dict, module_number: int) -> str:
    choices = quiz["choices"]
    choice_ids = [str(item["id"]) for item in choices]
    answer = str(quiz["answer"])
    if answer not in choice_ids or len(choice_ids) != len(set(choice_ids)):
        raise ValueError(f"module {module_number} quiz {quiz['id']}: invalid answer or duplicate choices")
    buttons = "".join(
        f'<button data-choice="{html.escape(str(item["id"]))}" aria-pressed="false">'
        f'{html.escape(str(item["textZh"]))}</button>'
        for item in choices
    )
    return (
        f'<div class="quiz" data-quiz="m{module_number}-{html.escape(str(quiz["id"]))}" '
        f'data-answer="{html.escape(answer)}" '
        f'data-correct="{html.escape(str(quiz["correctFeedbackZh"]))}" '
        f'data-incorrect="{html.escape(str(quiz["incorrectFeedbackZh"]))}">'
        f'<p><strong>问题：</strong>{html.escape(str(quiz["questionZh"]))}</p>'
        f'<div class="quiz-options">{buttons}</div><p class="quiz-feedback" aria-live="polite"></p></div>'
    )


def lesson_markup(course: dict, module: dict) -> str:
    number = int(module["number"])
    code = html.escape(str(course.get("code", "")))
    topics = " · ".join(html.escape(str(item)) for item in course.get("tags", [])[:4])
    prerequisites = module.get("prerequisitesZh") or []
    prerequisite_markup = ""
    if prerequisites:
        prerequisite_markup = '<h2 id="prerequisites">先修回顾</h2>' + list_markup(prerequisites)
    misconceptions = "".join(
        '<article class="summary-card">'
        f'<h3>{html.escape(str(item["claimZh"]))}</h3>'
        f'<p>{html.escape(str(item["correctionZh"]))}</p></article>'
        for item in module["misconceptions"]
    )
    references = "".join(
        f'<li>{evidence_label(item)} · {html.escape(str(item.get("evidence", "")))}</li>'
        for item in module["references"]
    )
    return (
        f'<p class="eyebrow">{code} · 第 {number} 讲</p>'
        f'<h1>{html.escape(str(module["titleZh"]))}</h1>'
        f'<p class="lede">{html.escape(str(module["ledeZh"]))}</p>'
        '<div class="meta">'
        f'<span>预计用时：{int(module["estimatedMinutes"])} 分钟</span>'
        f'<span>难度：{html.escape(str(module["difficultyZh"]))}</span>'
        f'<span>{topics or "离散数学与概率"}</span></div>'
        '<hr class="rule">'
        '<h2 id="objectives">学习目标</h2>'
        f'{list_markup(module["objectivesZh"])}'
        f'{prerequisite_markup}'
        + "".join(section_markup(section) for section in module["sections"])
        + '<h2 id="misconceptions">常见误区</h2><div class="summary-grid">'
        + misconceptions
        + '</div><h2 id="quiz">知识检查</h2>'
        + "".join(quiz_markup(quiz, number) for quiz in module["quizzes"])
        + '<h2 id="recap">本讲要点</h2>'
        + list_markup(module["recapZh"])
        + '<h2 id="sources">一手资料</h2><ul>'
        + references
        + '</ul><footer id="pb-page-end"><p>'
        + html.escape(f"{course.get('course', code)} · {course.get('term', '')}")
        + '</p></footer>'
    )


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
    lecture_by_number = {int(item["number"]): item for item in info.get("lectures", [])}
    modules = []
    for data_path in args.data:
        payload = json.loads(Path(data_path).expanduser().resolve().read_text(encoding="utf-8"))
        modules.extend(payload.get("modules") or [])
    if not modules:
        parser.error("no extracted modules found")

    rendered = []
    seen = set()
    for module in modules:
        number = int(module["number"])
        if number in seen:
            raise ValueError(f"duplicate module number: {number}")
        seen.add(number)
        lecture = lecture_by_number.get(number)
        if not lecture:
            raise ValueError(f"module {number} has no scaffolded lecture")
        page_path = course_dir / lecture["lessonFile"]
        soup = BeautifulSoup(page_path.read_text(encoding="utf-8"), "html.parser")
        page = soup.select_one(".page")
        if page is None:
            raise ValueError(f"module {number}: page shell is missing")
        fragment = BeautifulSoup(lesson_markup(info, module), "html.parser")
        page.clear()
        for child in list(fragment.contents):
            page.append(child)
        if soup.title:
            soup.title.string = f'{module["titleZh"]} — {info.get("code", "")}'
        page_path.write_text(str(soup), encoding="utf-8")
        lecture.update({
            "title": module["titleEn"],
            "titleZh": module["titleZh"],
            "sourceFiles": module["sourceFiles"],
        })
        rendered.append(str(page_path))

    info_path.write_text(json.dumps(info, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"modules": len(modules), "pages": rendered}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
