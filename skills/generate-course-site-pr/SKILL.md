---
name: generate-course-site-pr
description: Turn a local folder of course PDFs, PPT/PPTX slides, syllabi, homework, labs, notes, code, figures, and an official course homepage into a complete CourseStack v3 GitHub Pages course under the shared courses directory, including source-backed math visualizations and interactive learning components when useful, then validate it and open a pull request against PointBreaker/Pointbreaker.github.io. Use when Codex is launched inside a course-resource folder and the user wants a new course site, a data-driven course Dashboard, polished lecture and assignment pages, visual or interactive explanations, resource-to-frontend generation, or an automated course PR.
---

# Generate Course Site PR

Build an evidence-backed Chinese course guide from local materials, use the shared CourseStack v3 design system, and stop at a reviewable pull request.

## Guardrails

- Treat the current directory as the source folder unless the user names another folder.
- Default to `PointBreaker/Pointbreaker.github.io`, base branch `main`, and branch `course/<slug>`.
- Never access `drive.google.com` or `docs.google.com`. Use downloaded local copies and report skipped links.
- Never push to `main`, merge a PR, overwrite an existing course, discard unrelated changes, or publish source files without authorization.
- Never invent schedule facts, requirements, formulas, results, or citations. Record unresolved gaps and omit unsupported claims.
- Keep source materials and `.course-build/` outside the website commit.

## Workflow

### 0. Synchronize the Skill

Before inspecting course materials, run:

```bash
python <skill-root>/scripts/sync_skill.py --skill-root <skill-root> --json
```

Only use the canonical `PointBreaker/Pointbreaker.github.io` source. If the sandbox blocks network access, retry once with the required network approval. Never use Google Drive or Docs for synchronization.

- On `updated`, immediately re-read `<skill-root>/SKILL.md` from the beginning and follow the updated workflow. Re-run the command once; the second result should be `up-to-date`.
- On `up-to-date` or `disabled`, continue normally.
- On `offline` or `error`, continue with the bundled version and mention the skipped update in the final handoff.
- On `local-modified`, do not use `--force` automatically. Preserve the local edits, continue with the installed version, and report the conflict.

The updater may write only inside `<skill-root>`. Set `COURSESTACK_SKILL_AUTO_UPDATE=0` to opt out.

### 1. Inventory local resources

Run:

```bash
python <skill-root>/scripts/inventory_resources.py --source "$PWD" --output "$PWD/.course-build"
```

Read the generated inventory and extracted text. Inspect PDF pages visually when equations, diagrams, or layout matter. Reconcile duplicates, mixed terms, missing sessions, and ambiguous filenames before drafting.

### 2. Establish canonical course facts

Use the official homepage for the schedule, course identity, public links, and mapping only. Follow first-party links except Google Drive/Docs. Prefer local official handouts and slides over summaries.

Read [references/content-quality.md](references/content-quality.md) before writing content.
Read [references/interactive-content.md](references/interactive-content.md) when the course contains mathematical relationships, diagrams, matrices, parameter-sensitive behavior, algorithms, or multi-stage processes that may benefit from a visual explanation.
Read [references/claude-code-extraction.md](references/claude-code-extraction.md) before delegating high-volume local text extraction to Claude Code. Keep source interpretation, dependency modeling, content decisions, frontend architecture, and final QA in the primary agent.

### 3. Create the course plan

Create `.course-build/course-plan.json` using [references/site-contract.md](references/site-contract.md). Put `sourceFiles` on every lecture and work item. Add a `visuals` array only for justified source-backed figures or interactives, recording `id`, `kind`, `learningGoal`, `sourceFiles`, and `reason`. Verify numbering, term, titles, dependencies, slug, summary, domain, tags, and the catalog card copy. For courses with homework and exams, model the curricular sequence explicitly with `dependsOn` so the Dashboard can render each lecture exactly once as `Lecture → HW → Exam` stages.

### 4. Prepare an isolated branch

Use a clean clone or separate worktree. Fetch `origin/main`, create `course/<slug>`, and preserve all unrelated user changes. Read [references/pr-workflow.md](references/pr-workflow.md).

### 5. Scaffold CourseStack v3

Run:

```bash
python <skill-root>/scripts/scaffold_course.py \
  --repo /path/to/Pointbreaker.github.io \
  --plan "$PWD/.course-build/course-plan.json"
```

The script requires `site-platform.json` version 3+, creates the course under `courses/<slug>/`, writes its Dashboard and content stubs, normalizes JSON, and adds one entry to `courses.json`. It uses shared site assets and does not copy another course or duplicate KaTeX fonts.

### 6. Write complete course content

Replace every `COURSE_CONTENT_TODO` with source-grounded content.

- Organize each lecture around conceptual dependencies, derivations, worked examples, implementation notes, misconceptions, recap, quizzes, and primary references.
- Organize each homework/lab/project guide around objectives, prerequisites, task structure, setup, deliverables, validation, and common failure modes.
- Use `\(...\)` and `\[...\]` for math. Never split identifiers with math delimiters or put LaTeX inside code.
- Add 2–5 meaningful quizzes with a valid container `data-answer`.
- Create static SVG diagrams, function plots, matrix heatmaps, or steppers only when they materially improve understanding. Follow [references/interactive-content.md](references/interactive-content.md), store course-owned files under `figures/` and `interactives/`, and require a static fallback for every interactive.
- Use the shared declarative interactive runtime. Never add inline JavaScript, arbitrary executable expressions, external chart libraries, CDN scripts, or remote interactive data.
- Do not publish graded solutions unless explicitly authorized.

### 7. Refresh and validate

Run:

```bash
python <skill-root>/scripts/refresh_status.py --repo /path/to/repo --slug <slug>
python <skill-root>/scripts/validate_course.py \
  --repo /path/to/repo \
  --slug <slug> \
  --plan "$PWD/.course-build/course-plan.json" \
  --inventory "$PWD/.course-build/inventory.json" \
  --strict-resources
python <skill-root>/scripts/validate_interactive.py --repo /path/to/repo --slug <slug>
python /path/to/repo/tools/check-course-layout.py
git diff --check
```

Serve the repository locally. Inspect the homepage catalog entry, Dashboard, at least two lectures, every page type, representative math and code, quiz feedback, the GitHub Discussion drawer, mobile width, links, and browser console. On courses with exams, verify stage boundaries, `Lecture → HW → Exam` order, non-repeated lectures, separate HW/Exam counts and filters, and every work-item link. On desktop, verify that opening Discussion reserves space instead of covering the lesson. Treat placeholders, math errors, clipped layouts, missing shared assets, broken navigation, invalid dependency stages, and overlapping discussion UI as blockers.

### 8. Open the PR

Review the complete diff. Stage only `courses/<slug>/**` and `courses.json`, commit, push the course branch, and use `gh pr create`.

Return the PR URL, branch, commit, page counts, figure and interactive counts, resource coverage, validation results, and known source gaps. Do not claim completion if sources remain unmapped or browser QA was skipped.

## Runtime outputs

Keep disposable work in `<source-folder>/.course-build/`. Commit only `courses/<slug>/` and its `courses.json` catalog entry unless the user explicitly expands scope.
