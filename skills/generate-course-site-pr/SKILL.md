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

### 2. Detect the course type and plan the learning system

Read [references/course-type-profiles.md](references/course-type-profiles.md), select one primary profile plus any justified secondary profile, and record the choice and evidence in `.course-build/course-plan.json`. The profile determines the nouns, state model, worked-trace form, exercise types, and failure questions; never pour every discipline into one generic lesson template.

Create `.course-build/course-plan.json` using [references/site-contract.md](references/site-contract.md). Map every official session and work item exactly once. Include inventory-relative `sourceFiles`, corresponding URLs in the source map, dependencies, term, provenance, and justified visuals. Before page composition, add:

- a concept dependency graph;
- observable learning objectives stated as derivation, prediction, diagnosis, or implementation capabilities;
- a depth ledger for every page;
- two to four `goldLessons` chosen for centrality, mechanism richness, assignment leverage, and misconception risk.

Build a depth ledger for every page:

```text
source coverage | reasoning gaps | prerequisite gaps | misconception risks
practice gap | visual need | version status | required action
```

Prioritize source/version correctness, then core mental models, then practice and Workbook depth, then visual/reading polish. A diagram-only pass never counts as a course-level optimization. Do not author the complete course yet.

### 3. Prepare the repository safely

Read [references/pr-workflow.md](references/pr-workflow.md). For a new course, use a clean task branch or worktree and scaffold with:

```bash
python3 <skill-root>/scripts/scaffold_course.py \
  --repo /path/to/Pointbreaker.github.io \
  --plan "$PWD/.course-build/course-plan.json"
```

For an existing course, edit the responsible content/data/renderer layer in place. Do not scaffold over it or change historical filenames merely to match new titles.

### 4. Pass the Mechanism Gate before writing

Read [references/mechanism-depth-practice.md](references/mechanism-depth-practice.md). For every major concept, answer the ten Mechanism Gate questions from source evidence before composing prose. If the objects, saved state, event, transition, output, invariant, and counterfactual are not known, set the item to `DO_NOT_WRITE_YET`, research further, or mark it `BLOCKED_BY_SOURCE`. Do not hide the gap with a definition or generic example.

### 5. Build and approve the Gold Standard lessons

Read:

- [references/content-quality.md](references/content-quality.md)
- [references/lesson-learning-system.md](references/lesson-learning-system.md)
- [references/gold-standard-workflow.md](references/gold-standard-workflow.md)
- [references/reading-flow.md](references/reading-flow.md)
- [references/interactive-content.md](references/interactive-content.md) when a real visual relationship is present

Complete only the selected two to four Gold Standard lessons first. Each must close causal and derivation gaps with a full worked trace, concrete counterfactual, misconception analysis, diagnostic practice, implementation bridge where applicable, and a calm reading flow. Compare their understanding depth, trace quality, exercise density, and reading flow with a mature CourseStack lesson; do not compare raw word count.

Run the human-quality self-review in the Gold Standard workflow. If a learner could not reconstruct the mechanism, hand-simulate an example, predict a failure, name saved state, and justify an implementation condition, mark the lesson `SHALLOW` and revise it. Do not scale a failed Gold slice.

### 6. Scale the approved teaching pattern

Only after the Gold lessons pass, extend their reasoning standard—not their exact component count—to the remaining lessons. Match the profile and topic: topology/table evolution for routing, state/timeline for transport, end-to-end journeys for applications, topology/traffic for datacenters, channel/state/time for wireless, tensor/shape/dataflow for ML, and invariant/counterexample for algorithms or theory.

Close causal and derivation gaps, not just coverage gaps. Use concept-specific toy examples, object relationships, counterexamples, diagnostic practice, real systems, and cross-lesson continuity. Keep practice proportional to the concept; do not mechanically paste identical sections into every page. A core lesson with one recall quiz is `INSUFFICIENT`, regardless of page count or visual polish.

Prefer semantic HTML/CSS or static SVG framework diagrams for architecture, state, topology, tensor flow, and object relationships. ASCII is acceptable only for a compact inline sequence where a real diagram would not improve comprehension.

### 7. Build Engineering Workbooks

When the course has assignments, labs, projects, or exams, read [references/assignment-learning-system.md](references/assignment-learning-system.md). Organize current official work into dependency-first stages with contracts, invariants, sanity checks, failure signatures, progressive hints, prediction/experiment/evidence loops, and capability gates. Never provide submit-ready implementation or unauthorized solutions.

If the course has official discussion sheets, recitations, tutorials, or worksheets, read [references/discussion-reconstruction.md](references/discussion-reconstruction.md). A Discussion is a Guided Reasoning Workbook, not an Engineering Workbook and not a PDF index. Read both worksheet and official solution; audit substantive subproblems; then reconstruct original, self-contained problems with setup, prediction, learner work, progressive hints, reveal, explanation, wrong turn, and variation. Preserve official IDs for coverage, not copied prose. Build and review two Gold Discussions before scaling every published Discussion to at least `DIGESTED`.

If the learner has a prior implementation repository, also read [references/historical-implementation-recap.md](references/historical-implementation-recap.md). Treat the recap as a separate profile, not a decorative history section inside the current Workbook. Audit the repository, starter boundary, tests, handout, and commit history before attribution; then teach `Code → Mechanism → State → Invariant → Execution Trace → Failure → Mental Model`. Only evidence-backed edits may carry `YOUR CODE · Historical Implementation`; everything inherited from the starter or framework must be `Framework Context`. A historical recap may reach Gold depth while the current assignment remains `BLOCKED_BY_SOURCE`.

Choose the problem-statement strategy from source rights and term status:

- current, publishable, verified statement → localized first-class problem resource;
- current but not redistributable → Chinese problem guide + official handout/repository;
- older localized statement → independent historical archive or short delta, never mixed into the active curriculum;
- missing official details → mark the gap; do not manufacture an “official” task.

Read [references/solution-bearing-coursework.md](references/solution-bearing-coursework.md) only when official solutions exist and publication is explicitly authorized.

### 8. Run a reading-flow pass

After content depth is complete, stop adding topics. Apply [references/reading-flow.md](references/reading-flow.md) across every Lecture and Assignment:

- one current-term narrative;
- one useful TOC per viewport;
- compact provenance;
- no opening card stack, card dashboard, giant legacy disclosure, or unexplained ASCII framework;
- examples after the mechanism unless they deliberately pose the problem;
- optional detail in Deep Dive, required prerequisites in the main flow;
- short `Next` transitions so the course reads as connected chapters.

Aim for equal or lower word count during this pass.

### 8.1 Apply the shared Chinese Reader profile

CourseStack is a long-form Chinese technical textbook, not a dashboard. When a course is created or refreshed, apply the shared reader layer to the platform home, that course home, and every published content family (Lecture, Discussion, Project/Workbook, Lab, Review, and Exam). Reuse the shared `reader.css`, `reader-dashboard.css`, `reader.js`, and semantic component tokens instead of inventing course-local visual systems.

The default information architecture is:

```text
platform home → course identity / resume → stage map → Lecture / Discussion / Project
content page → breadcrumb / title / core question → prose / diagram / table / code / trace → contextual notes → next step
```

Use Chinese as the primary UI language while retaining necessary English technical terms. Keep one measured reading column, a light auxiliary TOC only when the page has no equivalent navigation, and a responsive inline fallback below desktop widths. Normalize shared components for `心智模型 / Why / Invariant / 易错点 / Failure / Historical Note / Source`, code headers and copy, Prediction/Hint/Reveal/Variation, and progress/resume controls. Legacy heroes must be re-homed into the reader intro when needed, so a dark banner or delayed course script cannot create a duplicate title/navigation. Do not add a second TOC, persistent inspector, opening card wall, decorative gradient, or heavy metadata panel merely because a course has extra data.

Before calling the visual layer complete, render at least one Lecture, one Discussion, one Project/Workbook, the platform home, and the course home at desktop and mobile widths. Check that Chinese labels, source disclosures, code/math, links, keyboard focus, copy/reveal interactions, progress state, and horizontal overflow remain usable. A page that loads but still looks like an unrelated legacy dashboard is not complete; migrate its CSS boundary or explicitly record the exception and reason.

### 9. Run Depth QA and validate observable behavior

First run the evidence-oriented depth audit:

```bash
python3 <skill-root>/scripts/audit_lesson_depth.py --repo /path/to/repo --slug <slug> --json
python3 <skill-root>/scripts/audit_workbook_depth.py --repo /path/to/repo --slug <slug> --json
python3 <skill-root>/scripts/audit_discussion_coverage.py --repo /path/to/repo --slug <slug> --json
```

Treat it as a regression detector, not a quality oracle. Manually decide `GOLD / GOOD / SHALLOW / BLOCKED_BY_SOURCE` using the closed-book questions in [references/mechanism-depth-practice.md](references/mechanism-depth-practice.md). `GOLD` requires both detectable evidence and human review; matching CSS classes alone never prove quality.

Run the applicable repository and Skill validators:

```bash
python3 <skill-root>/scripts/refresh_status.py --repo /path/to/repo --slug <slug>
python3 <skill-root>/scripts/validate_course.py --repo /path/to/repo --slug <slug> --plan <plan> --inventory <inventory> --strict-resources
python3 <skill-root>/scripts/validate_interactive.py --repo /path/to/repo --slug <slug>
python3 <skill-root>/scripts/validate_assignment_localization.py --repo /path/to/repo --slug <slug> --baseline-ref origin/main
node /path/to/repo/tools/lint-all-courses.mjs
git diff --check
```

Read [references/render-qa.md](references/render-qa.md). Adapt commands to repository capabilities; do not pretend a skipped tool passed. Serve the site and inspect representative rendered pages at desktop and mobile widths. Verify routes, anchors, only one visible TOC, source disclosures, math, code, diagrams, quiz diagnosis/follow-up behavior, Assignment stages/gates, official links, keyboard focus, horizontal overflow, console errors, and reduced motion. Compare source and runtime DOM when JavaScript restructures the page. For any discovered math-render defect, scan every course page for the same defect class before closing the issue.

For a long course, complete and validate one coherent phase at a time. Commit or publish each phase only when the user explicitly requested staged publication.

### 10. Reverse-validate and deliver

Before delivery, apply the refactored Skill to the changed course as if it were a fresh review. Record which gates caught real defects, which requirements could not be verified automatically, and whether any lesson status must be downgraded. If the course reveals a repeatable gap in this procedure or its validators, repair the Skill and rerun its validation before delivery.

Review the complete diff and stage only task-owned files. Open a PR by default. Publish to the live branch only when explicitly requested, then verify the remote commit and public assets/pages; a successful push alone is not proof of deployment.

Return the branch/commit/PR or live URL, page counts, current-term source coverage, major teaching and reading-flow changes, validation results, and remaining source gaps. Never claim textbook depth, browser QA, current-version compatibility, or publication unless each was actually verified.
