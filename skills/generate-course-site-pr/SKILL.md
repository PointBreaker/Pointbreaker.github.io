---
name: generate-course-site-pr
description: Build or substantially refactor a CourseStack v3 course from official course resources, including textbook-style lessons, complete localized assignment statements, Engineering Workbooks, source/version boundaries, validation, and a reviewable PR or explicitly authorized publication. Use for new CourseStack courses, deep course refreshes, assignment localization recovery, or resource-to-frontend generation; do not use for a small isolated copy or CSS edit.
---

# Generate Course Site PR

Build or deeply refresh an evidence-backed Chinese course guide from local materials, preserve CourseStack's existing learning assets, and normally stop at a reviewable pull request.

## Guardrails

- Treat the current directory as the source folder unless the user names another folder.
- Default to `PointBreaker/Pointbreaker.github.io`, base branch `main`, and branch `course/<slug>`.
- Respect source and network constraints stated by the user for the current course build.
- Never push to `main`, merge a PR, overwrite an existing course, discard unrelated changes, or publish source files without explicit authorization. A direct publish request for an existing course authorizes only the validated, task-scoped changes.
- Never invent schedule facts, requirements, formulas, results, or citations. Record unresolved gaps and omit unsupported claims.
- Keep source materials and `.course-build/` outside the website commit.

## Choose the operating mode

### New course

Use the inventory, plan, isolated branch, scaffold, content, validation, and PR flow below.

### Existing-course refresh or recovery

Do not scaffold over the course. Before editing:

1. Inspect the current page source, runtime DOM, shared renderers, course metadata, and Git status.
2. Search Git history for prior localized handouts, stable problem IDs, guide regions, source notes, and earlier information architecture.
3. Classify existing content by meaning before moving it. Preserve human-authored guides, translated problems, official-source material, legacy supplements, and miscellaneous references as separate sets.
4. Record observable invariants such as problem ID lists and counts before the refactor. Use the localization validator with `--baseline-ref` when the page already exists in Git.
5. Modify only the layer responsible for the defect. Do not regenerate or retranslate content that is already present.

For lesson or assignment learning-experience work, read the matching contract before changing content or layout:

- [references/lesson-learning-system.md](references/lesson-learning-system.md)
- [references/assignment-learning-system.md](references/assignment-learning-system.md)

## Workflow

### 0. Synchronize the Skill

Before inspecting course materials, run:

```bash
python3 <skill-root>/scripts/sync_skill.py --skill-root <skill-root> --json
```

Only use the canonical `PointBreaker/Pointbreaker.github.io` source. If the sandbox blocks network access, retry once with the required network approval.

- On `updated`, immediately re-read `<skill-root>/SKILL.md` from the beginning and follow the updated workflow. Re-run the command once; the second result should be `up-to-date`.
- On `up-to-date` or `disabled`, continue normally.
- On `offline` or `error`, continue with the bundled version and mention the skipped update in the final handoff.
- On `local-modified`, do not use `--force` automatically. Preserve the local edits, continue with the installed version, and report the conflict.

The updater may write only inside `<skill-root>`. Set `COURSESTACK_SKILL_AUTO_UPDATE=0` to opt out.

### 1. Inventory local resources

Run:

```bash
python3 <skill-root>/scripts/inventory_resources.py --source "$PWD" --output "$PWD/.course-build"
```

Read the generated inventory and extracted text. Inspect PDF pages visually when equations, diagrams, or layout matter. Reconcile duplicates, mixed terms, missing sessions, and ambiguous filenames before drafting.

### 2. Establish canonical course facts

Use the official homepage for the schedule, course identity, public links, and mapping only. Follow first-party links when the current user authorizes and can access them; apply network restrictions per course build rather than hard-coding a provider ban. Prefer local official handouts and slides over summaries.

Read [references/content-quality.md](references/content-quality.md) before writing content.
Read [references/lesson-learning-system.md](references/lesson-learning-system.md) before writing or deeply restructuring Lessons.
Read [references/assignment-learning-system.md](references/assignment-learning-system.md) when the course has assignments, labs, projects, localized handouts, or Engineering Workbook pages.
Read [references/interactive-content.md](references/interactive-content.md) when the course contains mathematical relationships, diagrams, matrices, parameter-sensitive behavior, algorithms, or multi-stage processes that may benefit from a visual explanation.
Read [references/solution-bearing-coursework.md](references/solution-bearing-coursework.md) when local discussion solutions, homework solutions, answer keys, or worked solutions are present and the user authorizes publishing them.

### 3. Create the course plan

Create `.course-build/course-plan.json` using [references/site-contract.md](references/site-contract.md). Put `sourceFiles` on every lecture and work item. Add a `visuals` array only for justified source-backed figures or interactives, recording `id`, `kind`, `learningGoal`, `sourceFiles`, and `reason`. Verify numbering, term, titles, dependencies, slug, summary, domain, tags, and the catalog card copy. For courses with homework and exams, model the curricular sequence explicitly with `dependsOn` so the Dashboard can render each lecture exactly once as `Lecture → HW → Exam` stages.

### 4. Prepare an isolated branch

For a new course, use a clean clone or separate worktree, fetch `origin/main`, create `course/<slug>`, and preserve all unrelated user changes. For an existing-course refresh, keep the user's current branch only when the worktree state and requested delivery path make that safe; otherwise use a task branch or separate worktree. Read [references/pr-workflow.md](references/pr-workflow.md).

### 5. Scaffold CourseStack v3

Run:

```bash
python3 <skill-root>/scripts/scaffold_course.py \
  --repo /path/to/Pointbreaker.github.io \
  --plan "$PWD/.course-build/course-plan.json"
```

The script requires `site-platform.json` version 3+, creates the course under `courses/<slug>/`, writes its Dashboard and content stubs, normalizes JSON, and adds one entry to `courses.json`. It uses shared site assets and does not copy another course or duplicate KaTeX fonts.

### 6. Write complete course content

Replace every `COURSE_CONTENT_TODO` with source-grounded content.

- Organize each lecture as an interactive textbook: prerequisite recovery, the problem being solved, named-object relationships, toy examples, derivations, real-system consequences, misconceptions, counterexamples, local checks, closed-book explanation, cross-lesson connections, and primary references. Follow [references/lesson-learning-system.md](references/lesson-learning-system.md); do not mechanically add identical headings when a concept needs a different teaching path.
- Organize each homework/lab/project guide around objectives, prerequisites, task structure, setup, deliverables, validation, and common failure modes.
- Treat the Engineering Workbook, complete Chinese problem statements, and official handout/repository as three peer resources with different jobs. Follow [references/assignment-learning-system.md](references/assignment-learning-system.md); never demote complete problem statements into a generic reference disclosure.
- Treat discussion sheets, homework, and their solutions as paired resources. Preserve the original identifier with `displayNumber`, even when it contains suffixes such as `00a`.
- Localize every student-facing work item into natural Simplified Chinese. Preserve the original identifier for traceability, but never leave the learner dependent on an English-only statement.
- Make every homework and exam self-contained: include all functions, matrices, intervals, units, constraints, subparts, and figure data needed to answer it without opening a textbook, PDF, or external link. When the local source only gives a textbook reference, either reconstruct the statement from local evidence or add a clearly labeled source-aligned onsite equivalent exercise; never present an adaptation as the official original.
- Preserve the existing guide when refreshing extracted problem lists. Treat the guide and the complete problem outline as separate regions; automated reruns may replace only the generated outline markers.
- When the user explicitly authorizes solutions, publish the complete official solution under a collapsed disclosure after the self-contained question and a non-answer hint. Never mix solution text into the visible statement or hint.
- Use `\(...\)` and `\[...\]` for math. Prefer standard KaTeX commands; define any course-specific macro in the shared math runtime before publishing. Never split identifiers with math delimiters or put LaTeX inside code.
- Put every code or pseudocode sample in `<pre><code class="language-...">`; use an accurate Prism language such as `python`, `bash`, `c`, `cpp`, `json`, `matlab`, `pseudocode`, or `plaintext`, and escape HTML characters inside the code node.
- Give each major concept a proportionate opportunity for retrieval or transfer. Prefer inline Concept Checks plus an optional lesson-end Deep Quiz over placing every question at the bottom. Distractors must represent plausible misconceptions and feedback must explain all options. A correct answer makes a follow-up optional; a wrong answer reveals diagnosis and the follow-up automatically. Complete homework, discussion, lab, and exam pages use engineering predictions, sanity checks, gates, and source-backed problems instead of a large synthetic MCQ bank.
- Create static SVG diagrams, function plots, matrix heatmaps, or steppers only when they materially improve understanding. Follow [references/interactive-content.md](references/interactive-content.md), store course-owned files under `figures/` and `interactives/`, and require a static fallback for every interactive.
- Use the shared declarative interactive runtime. Never add inline JavaScript, arbitrary executable expressions, external chart libraries, CDN scripts, or remote interactive data.
- Do not publish graded solutions unless explicitly authorized.

### 7. Refresh and validate

Run:

```bash
python3 <skill-root>/scripts/refresh_status.py --repo /path/to/repo --slug <slug>
python3 <skill-root>/scripts/validate_course.py \
  --repo /path/to/repo \
  --slug <slug> \
  --plan "$PWD/.course-build/course-plan.json" \
  --inventory "$PWD/.course-build/inventory.json" \
  --strict-resources
python3 <skill-root>/scripts/validate_interactive.py --repo /path/to/repo --slug <slug>
python3 <skill-root>/scripts/validate_assignment_localization.py --repo /path/to/repo --slug <slug>
python3 /path/to/repo/tools/check-course-layout.py
python3 /path/to/repo/tools/check-table-columns.py
git diff --check
```

For an existing course, also compare localized problem IDs against the pre-change Git baseline:

```bash
python3 <skill-root>/scripts/validate_assignment_localization.py \
  --repo /path/to/repo \
  --slug <slug> \
  --baseline-ref origin/main
```

Serve the repository locally. Inspect the homepage catalog entry, Dashboard, at least two lectures, every page type, representative math and code, quiz feedback, the GitHub Discussion drawer, mobile width, links, and browser console. Confirm that no KaTeX node uses the error fallback color, `window.__mathRenderErrors` is empty, every `pre` owns a `code.language-*` child, and non-plaintext examples contain Prism tokens. On Lesson pages, verify the rendered learning flow, inline check placement, explanations for all choices, wrong/correct follow-up behavior, Deep Quiz disclosures, closed-book prompts, direct anchors, sticky TOC, and cross-lesson/Assignment links. On courses with exams, verify stage boundaries, `Lecture → HW → Exam` order, non-repeated lectures, separate HW/Exam counts and filters, and every work-item link. On assignment pages, verify the rendered DOM—not just the source file: Chinese statements are reachable from a top-level resource entry, problem links open and focus the target, Stage backlinks work, no problem row remains inside Deep Reference, disclosure nesting stays shallow, version labels are accurate, and the page has no horizontal overflow on desktop or mobile. On desktop, verify that opening Discussion reserves space instead of covering the lesson. For every table-bearing page type, verify that `.pb-table-scroll` has non-zero intrinsic width on desktop, stays within its parent, and becomes a full-width horizontal scroller on mobile; never combine `width: fit-content` with inline-size or size containment. Treat placeholders, math errors, unformatted code, clipped layouts, buried core assignment statements, exercise overload, collapsed or trailing-blank tables, missing shared assets, broken navigation, invalid dependency stages, and overlapping discussion UI as blockers.

### 8. Deliver the change

Review the complete diff. New courses normally stage only `courses/<slug>/**` and `courses.json`, commit, push the course branch, and use `gh pr create`.

For an existing-course maintenance task, stage only reviewed task files plus directly related validators or reports. Open a PR by default. Push to the live branch only when the user explicitly asks to publish; after pushing, verify the remote branch, poll the public page until its cache-busted asset version changes, and compare representative remote asset hashes with local files. A successful `git push` alone is not proof that the site is live.

Return the PR or live URL, branch, commit, page counts, figure and interactive counts, resource coverage, validation results, and known source gaps. Do not claim completion if sources remain unmapped, browser QA was skipped, or an explicitly requested publication has not appeared on the public site.

## Runtime outputs

Keep disposable work in `<source-folder>/.course-build/`. Commit only `courses/<slug>/` and its `courses.json` catalog entry unless the user explicitly expands scope.
