# Source discovery and course migration

Use this reference whenever the user supplies an official course URL, the active term may have changed, or CourseStack already contains a version of the course.

## Link-first discovery

Start from the exact URL the user supplied. Treat it as the identity root, not automatically as the complete syllabus. Apply repository and user-specified network restrictions to every follow-up; a blocked source remains an explicit gap.

1. Open the official homepage and identify institution, course code/title, active term, instructors, schedule, and archive links.
2. Follow first-party links to lecture pages, PDFs, slides, notes, code, notebooks, videos/transcripts, assignments, labs, starter repositories, tests, READMEs, changelogs, and datasets.
3. Follow official organization repositories and original papers only where the course points to them or they are needed to verify a technical claim.
4. Record inaccessible, authentication-gated, missing, or ambiguous resources. Do not silently substitute an older term or a third-party summary.
5. Download public working copies into `.course-build/sources/` when extraction or visual inspection is useful. Keep source URLs and retrieval dates; do not commit the downloads by default.

Use current first-party sources for facts that may change. Secondary sources may improve pedagogy only after the primary claim is established.

## Source map

Create `.course-build/source-map.json` with enough information to reproduce the course snapshot. A useful entry records:

```json
{
  "url": "https://example.edu/course/lecture01.pdf",
  "kind": "lecture-pdf",
  "term": "Spring 2026",
  "title": "Lecture 1: Introduction",
  "status": "available",
  "retrievedAt": "2026-09-02",
  "localPath": ".course-build/sources/lecture01.pdf",
  "redistribution": "link-only",
  "notes": "Official schedule entry"
}
```

Use explicit statuses such as `available`, `metadata-only`, `inaccessible`, `missing`, or `ambiguous`. `redistribution` should distinguish `publishable`, `redraw-only`, `link-only`, and `unknown`.

## Source-of-truth order

Resolve conflicts using the most specific current official evidence:

1. current official course homepage and schedule;
2. current lecture code/PDF/notes;
3. current assignment repository and tests;
4. repository changelog or release/tag;
5. current assignment handout;
6. existing CourseStack content;
7. archived official terms, only for comparison or still-valid explanation.

For implementation behavior, current tests and code may be more specific than prose. Record the version/commit instead of silently choosing one.

## Choosing the active term

- Prefer the term explicitly marked current on the official homepage.
- If the homepage is timeless, use the latest dated official schedule with complete materials.
- Never merge two terms into one active curriculum merely to fill gaps.
- An older source may support a stable concept, but it must not define current titles, requirements, APIs, hardware assumptions, or deliverables.
- Store the selected term and `checkedAt` in course metadata and reports.

## Detecting an existing course

Search `courses.json` and every `course-info.json` for matching homepage, institution/course code, aliases, and prior slugs. Also inspect historical filenames because routes may intentionally retain an older topic name.

If a course exists, record before editing:

-  page paths, titles, numbering, anchors, and progress identifiers;
-  shared renderers, practice banks, diagrams, and cache-busted asset versions;
-  current official/legacy source notes;
-  work-item IDs, localized problem counts, stage mappings, and version metadata;
-  Git history containing human-authored explanations or previously localized assets.

Do not infer that a stale filename means stale content or rename it if doing so breaks routes and progress.

## Required audits

### Version audit

For every Lecture and work item, record:

```text
current CourseStack state | official current state | delta | source | required action
```

Use statuses such as `CURRENT`, `PARTIAL`, `STALE`, `MIXED`, `SOURCE_MISMATCH`, and `VERSION_MISMATCH`.

### Teaching-depth audit

For every core concept, inspect prerequisite gaps, missing causal steps, object conflations, formula provenance, misconceptions, transfer practice, and visual needs. A long page may still be shallow; a diagram pass alone is not a teaching-depth pass.

### Reading-flow audit

Apply the classifications in [reading-flow.md](reading-flow.md): `KEEP / MERGE / MOVE / COMPRESS / ARCHIVE / REMOVE_FROM_MAIN_FLOW`.

Finish these audits before a bulk migration. They may live in `.course-build/` unless the user requests repository reports.

## Migration rules

For each existing section:

- **Still correct and aligned:** keep it; update provenance only when needed.
- **Conceptually correct but version-specific details stale:** preserve the explanation and replace IDs, examples, numbers, or interfaces.
- **Genuinely new official topic:** build it to the same teaching depth as surrounding lessons.
- **Superseded requirement with historical value:** compress to a short Historical Note.
- **Pure version history or retired task:** move to an independent archive/report or remove it from the active learning flow.

The final learner should see one current curriculum, not an old course with visible patches.

## Staged completion

For large courses, work in coherent phases:

1. source/version correctness and metadata;
2. core Lesson depth;
3. Assignment/Lab Workbook depth;
4. diagrams and reading-flow polish;
5. course-specific lint and full regression.

Validate each phase before proceeding. Commit/push each phase only when the user explicitly authorizes staged publication; otherwise keep one reviewable task branch.
