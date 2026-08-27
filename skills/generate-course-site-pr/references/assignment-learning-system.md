# Assignment learning-system contract

Use this contract for CourseStack homework, lab, project, and assignment pages. An Assignment is an Engineering Workbook that connects understanding to implementation and evidence; it is not a second Lesson and not merely a reformatted official handout.

## Three peer resources

Every substantial Assignment page should make these resources visibly distinct and equally reachable:

1. **Engineering Workbook** — CourseStack's stages, gates, contracts, sanity checks, debugging guidance, predictions, experiments, hints, and reflection.
2. **中文完整题面** — complete localized problem statements, original identifiers, tasks, constraints, deliverables, tests, and source status.
3. **Official Handout** — the authoritative repository, README, PDF, tests, and current-term requirements.

The Chinese problem statements are core learning material, not Deep Reference. The official source always wins when versions conflict.

Deep Reference is reserved for duplicated old guides, archived Cheatsheets, historical interfaces, older-term-only supplements, and other secondary material.

## Preserve before restructuring

For an existing page:

1. Inspect current HTML, rendered DOM, shared renderer/data files, and Git history.
2. Inventory translated problems by stable problem ID and count before editing.
3. Separate content semantically, for example:

```text
translatedProblems
officialSourceContent
legacyGuide
legacySupplement
miscReference
```

Do not classify information by whether it is an “old node.” Never move all previous siblings into one disclosure. Do not retranslate content that already exists.

If a translation is actually absent, recover only the missing problem DOM from history; never check out an old whole page over a current Workbook.

## Workbook stages

Group official problems into a small dependency-first engineering path while preserving every official number and ID. Each stage should contain:

- What You Are Building and Why This Exists;
- prerequisite Lesson links and “开始前应该已经会回答” prompts;
- Contract: input, output, shape/dtype where relevant, invariants, and forbidden assumptions;
- Definition of Done: Correct, Understand, and Evidence;
- Tiny Sanity Check that can be hand-computed or visually inspected;
- Failure Signatures and a debug ladder from shape/dtype through isolated tests to full integration;
- progressive Concept / Invariant / Debug Strategy hints, collapsed by default and never a full solution;
- Prediction → Controlled Experiment → Observation → Explanation when the task is empirical;
- a Gate that summarizes capability without hard-locking later content.

Keep official Problem IDs visible in each stage. Tests passing is necessary but not sufficient for systems, performance, data, scaling, or alignment work.

## Problem identity and bidirectional navigation

Each localized problem needs one stable anchor derived from its preserved identifier:

```text
train_bpe → #problem-train_bpe
```

Workbook official-problem entries and the localized Problem Index link to that anchor. Activating a link should open the target disclosure, move keyboard focus to its summary, apply a restrained highlight, update the URL hash, and respect `prefers-reduced-motion`.

Each mapped problem links back to its Workbook stage. A problem may belong to multiple stages; show multiple backlinks rather than duplicating the statement.

Unresolved mappings must be visible as `Official only`, `Legacy only`, or `Needs Review`; never fail silently or normalize the displayed official ID. A normalized alias may support navigation only when the original IDs remain visible and the mapping is documented.

## Problem Index and disclosure depth

Place a stage-grouped Problem Index at the top of the Chinese-statement section and reuse the Workbook's stage-to-official-ID data. Do not maintain a second manual mapping.

Individual problems may be collapsed by default. The normal path should be:

```text
中文完整题面 section → problem details
```

Do not require `Deep Reference → old guide → translated outline → problem`. Keep parent disclosure depth at one; a problem-internal advanced hint may add one more disclosure.

## Version and source semantics

Show a compact version notice that distinguishes:

- official current term and version;
- Workbook mapping basis;
- localized statement source term;
- legacy supplement status.

An ID match is not proof that interfaces, tests, constraints, hardware, or deliverables are current. Use language such as `2026 ID Matched · Needs Review` until the statement is checked against the current official source. Never label an older translation as the current official Chinese handout.

Keep repository, README, PDF, and tests easy to reach near the top and again in the Official Handout section when useful.

## Official task vs CourseStack guidance

Visually separate Stanford/instructor requirements from CourseStack prerequisites, implementation ordering, debugging suggestions, and hints. Preserve useful legacy guidance, but move solution-like material into a clearly labeled advanced hint rather than presenting it as part of the official task.

## Validation

For an existing course, run localization validation with a Git baseline. A refactor must not reduce the prior set of problem IDs unless the user explicitly authorized removal.

Browser QA must verify at least one representative Stage → Problem flow per Assignment and random problems across the remaining pages:

- top-level Workbook / 中文题面 / Official navigation works;
- the target opens, focuses, highlights, and has a Stage backlink;
- no problem row remains inside Deep Reference;
- translated problem counts and IDs match the source inventory;
- official-only and legacy-only mappings are visible;
- desktop retains a readable main column plus at most one side navigation;
- mobile has no page-level horizontal overflow and long titles wrap;
- source/version notices match the actual content.

When publishing, verify more than the Git push: wait until the public page references the new cache-busted assets, then compare representative remote asset hashes with local files.
