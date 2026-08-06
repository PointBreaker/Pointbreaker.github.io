---
name: generate-course-site-pr
description: Turn a local folder of course PDFs, PPT/PPTX slides, syllabi, homework, labs, notes, code, and an official course homepage into a complete CourseStack v2 GitHub Pages course, then validate it and open a pull request against PointBreaker/Pointbreaker.github.io. Use when Codex is launched inside a course-resource folder and the user wants a new course site, a data-driven course Dashboard, polished lecture and assignment pages, resource-to-frontend generation, or an automated course PR.
---

# Generate Course Site PR

Build an evidence-backed Chinese course guide from local materials, use the shared CourseStack v2 design system, and stop at a reviewable pull request.

## Guardrails

- Treat the current directory as the source folder unless the user names another folder.
- Default to `PointBreaker/Pointbreaker.github.io`, base branch `main`, and branch `course/<slug>`.
- Never access `drive.google.com` or `docs.google.com`. Use downloaded local copies and report skipped links.
- Never push to `main`, merge a PR, overwrite an existing course, discard unrelated changes, or publish source files without authorization.
- Never invent schedule facts, requirements, formulas, results, or citations. Record unresolved gaps and omit unsupported claims.
- Keep source materials and `.course-build/` outside the website commit.

## Workflow

### 1. Inventory local resources

Run:

```bash
python <skill-root>/scripts/inventory_resources.py --source "$PWD" --output "$PWD/.course-build"
```

Read the generated inventory and extracted text. Inspect PDF pages visually when equations, diagrams, or layout matter. Reconcile duplicates, mixed terms, missing sessions, and ambiguous filenames before drafting.

### 2. Establish canonical course facts

Use the official homepage for the schedule, course identity, public links, and mapping only. Follow first-party links except Google Drive/Docs. Prefer local official handouts and slides over summaries.

Read [references/content-quality.md](references/content-quality.md) before writing content.

### 3. Create the course plan

Create `.course-build/course-plan.json` using [references/site-contract.md](references/site-contract.md). Put `sourceFiles` on every lecture and work item. Verify numbering, term, titles, dependencies, slug, summary, domain, tags, and the catalog card copy.

### 4. Prepare an isolated branch

Use a clean clone or separate worktree. Fetch `origin/main`, create `course/<slug>`, and preserve all unrelated user changes. Read [references/pr-workflow.md](references/pr-workflow.md).

### 5. Scaffold CourseStack v2

Run:

```bash
python <skill-root>/scripts/scaffold_course.py \
  --repo /path/to/Pointbreaker.github.io \
  --plan "$PWD/.course-build/course-plan.json"
```

The script requires `site-platform.json` version 2+, creates the course Dashboard and content stubs, writes normalized JSON, and adds one entry to `courses.json`. It uses shared site assets and does not copy another course or duplicate KaTeX fonts.

### 6. Write complete course content

Replace every `COURSE_CONTENT_TODO` with source-grounded content.

- Organize each lecture around conceptual dependencies, derivations, worked examples, implementation notes, misconceptions, recap, quizzes, and primary references.
- Organize each homework/lab/project guide around objectives, prerequisites, task structure, setup, deliverables, validation, and common failure modes.
- Use `\(...\)` and `\[...\]` for math. Never split identifiers with math delimiters or put LaTeX inside code.
- Add 2–5 meaningful quizzes with a valid container `data-answer`.
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
git diff --check
```

Serve the repository locally. Inspect the homepage catalog entry, Dashboard, at least two lectures, every page type, representative math and code, quiz feedback, mobile width, links, and browser console. Treat placeholders, math errors, clipped layouts, missing shared assets, and broken navigation as blockers.

### 8. Open the PR

Review the complete diff. Stage only `<slug>/**` and `courses.json`, commit, push the course branch, and use `gh pr create`.

Return the PR URL, branch, commit, page counts, resource coverage, validation results, and known source gaps. Do not claim completion if sources remain unmapped or browser QA was skipped.

## Runtime outputs

Keep disposable work in `<source-folder>/.course-build/`. Commit only the new course directory and its `courses.json` catalog entry unless the user explicitly expands scope.
