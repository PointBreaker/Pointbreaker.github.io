---
name: generate-course-site-pr
description: "Build or deeply refactor a CourseStack course from an official course URL, with local resources optional: discover current first-party sources, reconcile terms, create textbook Lessons and Engineering Workbooks, repair reading flow, validate the rendered experience, and prepare a PR or explicitly authorized publication. Use for end-to-end course creation, migration, or teaching-experience upgrades; do not use for a small isolated copy or CSS edit."
---

# Generate CourseStack Course

Turn one official course link into a coherent Chinese self-study course. The learner should encounter one current curriculum, durable mental models, implementation-oriented practice, and a calm long-form reading experience—not lecture summaries, template-filled pages, or visible migration debris.

## Input contract

An official course URL is sufficient input. Do not ask the user to gather files that can be discovered from first-party pages.

- Infer course identity, current active term, institution, instructors, schedule, assignments, and source repositories from the official site.
- Follow official first-party links to public slides, PDFs, code, handouts, schedules, videos/transcripts, repositories, and changelogs. Download working copies only into `.course-build/sources/`; never commit source archives by default.
- If local resources are also present, inventory and reconcile them with the URL rather than assuming either set is current.
- Ask a question only when two plausible curricula would produce materially different courses and no official evidence resolves the choice. Otherwise choose the current official term, record `checkedAt`, and proceed.
- An inaccessible optional source is a recorded coverage gap, not a reason to stop. Stop only when the course identity or a core deliverable cannot be established without new access or authority.

Read [references/source-discovery-and-migration.md](references/source-discovery-and-migration.md) before browsing, choosing a term, or editing an existing course.

## Guardrails

- Treat official current-term material as the source of truth. Existing CourseStack prose and older terms are evidence to audit, not authority.
- Respect repository and task-specific network/source restrictions while discovering materials; record blocked sources instead of bypassing policy or silently substituting them.
- Preserve still-correct human-authored teaching, stable routes, progress identifiers, official problem IDs, and useful visuals. Do not delete and regenerate a mature course merely because the term changed.
- Never invent schedule facts, requirements, formulas, benchmark results, or citations. Bind version-sensitive claims to source, conditions, and date.
- Keep instructor content, CourseStack explanation, and historical context visibly distinct.
- Do not republish source PDFs, starter repositories, images, complete copyrighted handouts, or solutions unless redistribution and the user's authorization permit it. Link the official resource and create a clean-room Chinese Workbook when full localization is not publishable.
- Do not discard unrelated worktree changes, overwrite another course, force-push, merge a PR, or publish without explicit authorization. A direct publish request authorizes only validated task-scoped changes.
- Keep disposable sources, extraction output, audits-in-progress, and screenshots in `.course-build/` unless a final report is requested as a repository artifact.

## Choose the operating mode

### New course

No matching CourseStack course exists. Build a canonical source map and plan, scaffold CourseStack v3, then author the complete course.

### Existing-course migration or deep refresh

The repository already contains the course or a prior term. Audit before editing:

1. Inspect course metadata, all page families, runtime renderers, practice banks, figures, source links, Git history, and worktree state.
2. Produce a version/content matrix: `current page | official current state | delta | action`.
3. Classify each section as `KEEP / MERGE / MOVE / COMPRESS / ARCHIVE / REWRITE`.
4. Record invariants such as routes, page counts, problem IDs, anchors, progress keys, and interactive behavior.
5. Preserve correct pedagogy; deeply rewrite only stale, shallow, or genuinely new material.

Do not begin a bulk rewrite before this audit is complete.

## Workflow

### 0. Synchronize this Skill

Run:

```bash
python3 <skill-root>/scripts/sync_skill.py --skill-root <skill-root> --json
```

On `updated`, re-read this file and run synchronization once more. On `local-modified`, preserve local edits. On `offline` or `error`, continue with the bundled version and report the skipped update. Set `COURSESTACK_SKILL_AUTO_UPDATE=0` to opt out.

### 1. Discover and freeze the source snapshot

Follow [references/source-discovery-and-migration.md](references/source-discovery-and-migration.md). Create `.course-build/source-map.json` and a concise audit before drafting. Establish:

- canonical term, schedule, titles, instructors, dates, and stable source URLs;
- current lecture materials and official repositories;
- assignment versions from handouts, repository tags/changelogs, tests, and code—not guessed metadata;
- archived-term deltas and which existing explanations remain valid;
- redistribution/licensing boundaries and unresolved coverage gaps.

Create `.course-build/sources/` even when the official course exposes only HTML, place any downloaded working copies there, then run:

```bash
python3 <skill-root>/scripts/inventory_resources.py \
  --source "$PWD/.course-build/sources" \
  --output "$PWD/.course-build"
```

Inspect source figures visually when equations, diagrams, or layout carry meaning.

### 2. Plan the whole learning system

Create `.course-build/course-plan.json` using [references/site-contract.md](references/site-contract.md). Map every official session and work item exactly once. Include inventory-relative `sourceFiles`, corresponding URLs in the source map, dependencies, term, provenance, and justified visuals.

Build a depth ledger for every page:

```text
source coverage | reasoning gaps | prerequisite gaps | misconception risks
practice gap | visual need | version status | required action
```

Prioritize source/version correctness, then core mental models, then practice and Workbook depth, then visual/reading polish. A diagram-only pass never counts as a course-level optimization.

### 3. Prepare the repository safely

Read [references/pr-workflow.md](references/pr-workflow.md). For a new course, use a clean task branch or worktree and scaffold with:

```bash
python3 <skill-root>/scripts/scaffold_course.py \
  --repo /path/to/Pointbreaker.github.io \
  --plan "$PWD/.course-build/course-plan.json"
```

For an existing course, edit the responsible content/data/renderer layer in place. Do not scaffold over it or change historical filenames merely to match new titles.

### 4. Build textbook Lessons

Read:

- [references/content-quality.md](references/content-quality.md)
- [references/lesson-learning-system.md](references/lesson-learning-system.md)
- [references/reading-flow.md](references/reading-flow.md)
- [references/interactive-content.md](references/interactive-content.md) when a real visual relationship is present

Close causal and derivation gaps, not just coverage gaps. Use concept-specific toy examples, object relationships, counterexamples, diagnostic practice, real systems, and cross-lesson continuity. Keep practice proportional to the concept; do not mechanically paste identical sections into every page.

Prefer semantic HTML/CSS or static SVG framework diagrams for architecture, state, topology, tensor flow, and object relationships. ASCII is acceptable only for a compact inline sequence where a real diagram would not improve comprehension.

### 5. Build Engineering Workbooks

When the course has assignments, labs, projects, or exams, read [references/assignment-learning-system.md](references/assignment-learning-system.md). Organize current official work into dependency-first stages with contracts, invariants, sanity checks, failure signatures, progressive hints, prediction/experiment/evidence loops, and capability gates. Never provide submit-ready implementation or unauthorized solutions.

Choose the problem-statement strategy from source rights and term status:

- current, publishable, verified statement → localized first-class problem resource;
- current but not redistributable → Chinese problem guide + official handout/repository;
- older localized statement → independent historical archive or short delta, never mixed into the active curriculum;
- missing official details → mark the gap; do not manufacture an “official” task.

Read [references/solution-bearing-coursework.md](references/solution-bearing-coursework.md) only when official solutions exist and publication is explicitly authorized.

### 6. Run a reading-flow pass

After content depth is complete, stop adding topics. Apply [references/reading-flow.md](references/reading-flow.md) across every Lecture and Assignment:

- one current-term narrative;
- one useful TOC per viewport;
- compact provenance;
- no opening card stack, card dashboard, giant legacy disclosure, or unexplained ASCII framework;
- examples after the mechanism unless they deliberately pose the problem;
- optional detail in Deep Dive, required prerequisites in the main flow;
- short `Next` transitions so the course reads as connected chapters.

Aim for equal or lower word count during this pass.

### 7. Validate observable behavior

Run the applicable repository and Skill validators:

```bash
python3 <skill-root>/scripts/refresh_status.py --repo /path/to/repo --slug <slug>
python3 <skill-root>/scripts/validate_course.py --repo /path/to/repo --slug <slug> --plan <plan> --inventory <inventory> --strict-resources
python3 <skill-root>/scripts/validate_interactive.py --repo /path/to/repo --slug <slug>
python3 <skill-root>/scripts/validate_assignment_localization.py --repo /path/to/repo --slug <slug> --baseline-ref origin/main
node /path/to/repo/tools/lint-all-courses.mjs
git diff --check
```

Adapt commands to repository capabilities; do not pretend a skipped tool passed. Serve the site and inspect representative rendered pages at desktop and mobile widths. Verify routes, anchors, only one visible TOC, source disclosures, math, code, diagrams, quiz diagnosis/follow-up behavior, Assignment stages/gates, official links, keyboard focus, horizontal overflow, console errors, and reduced motion. Compare source and runtime DOM when JavaScript restructures the page.

For a long course, complete and validate one coherent phase at a time. Commit or publish each phase only when the user explicitly requested staged publication.

### 8. Deliver

Review the complete diff and stage only task-owned files. Open a PR by default. Publish to the live branch only when explicitly requested, then verify the remote commit and public assets/pages; a successful push alone is not proof of deployment.

Return the branch/commit/PR or live URL, page counts, current-term source coverage, major teaching and reading-flow changes, validation results, and remaining source gaps. Never claim textbook depth, browser QA, current-version compatibility, or publication unless each was actually verified.
