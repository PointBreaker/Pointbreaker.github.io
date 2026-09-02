# Assignment learning-system contract

Use this contract for CourseStack homework, labs, projects, and assignments. An Assignment is an Engineering Workbook that turns Lesson understanding into implementation and evidence; it is not a second Lesson, a quiz bank, or version archaeology.

## Active resource hierarchy

Every active page should make two resources immediately clear:

1. **Engineering Workbook** — CourseStack stages, contracts, sanity checks, debugging guidance, predictions, experiments, hints, gates, and reflection.
2. **Official sources** — the current repository, README, handout/PDF, tests, datasets, and current-term requirements. These are authoritative.

A third first-class resource, **中文完整题面**, is appropriate only when the statement is current-term verified and redistribution/localization is permitted. Do not assume that an older translation or a publicly viewable PDF can be republished as the current Chinese handout.

When full statement localization is not publishable, provide a Chinese Problem Guide that explains goals, dependencies, interfaces at a high level, evidence expectations, and stable official IDs without reproducing the handout. Link the official source for exact requirements.

## Current term vs history

The active Assignment tells the learner what to build now. Handle older material according to [reading-flow.md](reading-flow.md):

- still-valid engineering guidance → merge into the current Workbook;
- useful change in method → short `Historical note · old → current`;
- old interfaces, retired tasks, and complete prior handouts → independent archive/report outside the active DOM.

Do not place a full previous-term assignment inside a large disclosure on the active page. The learner should never need to infer which tests, model, hardware, dataset, IDs, or deliverables are current.

## Preserve before restructuring

For an existing page:

1. Inspect current HTML, rendered DOM, shared renderer/data files, official links, and Git history.
2. Inventory official IDs, anchors, stage mappings, translated problem counts, and source terms before editing.
3. Classify content semantically: current Workbook, current official map, current verified localization, still-valid guidance, retired interfaces, historical archive, and miscellaneous reference.
4. Preserve existing human-authored explanations that remain correct; recover missing historical content surgically rather than checking out an old whole page.
5. Add regression assertions for counts, IDs, active/archive separation, and broken anchors when a future renderer could bury or reinsert content.

Never classify information only because it is an “old node,” and never move all previous siblings into one generic disclosure.

## Dependency-first stages

Use the primary [course type profile](course-type-profiles.md) to choose the Workbook's native evidence. Networking work should require packet/state/table/timeline traces and identify the invariant protected by an implementation branch; ML work should expose tensor shapes, dataflow, parameters, gradients, and compute; algorithms work should expose iteration state and invariants; theory work should expose definitions, proof dependencies, and counterexamples.

Group current official problems into a small engineering path while preserving every official number and ID. Each stage should answer:

- **What You Are Building** and **Why This Exists**;
- **Depends On** with section-level Lesson links;
- **Before You Start** prompts that reveal prerequisite gaps without becoming another exam;
- **Contract**: input, output, shape/dtype where relevant, invariants, and forbidden assumptions;
- **Definition of Done**: Correct, Understand, and Evidence;
- **Tiny Sanity Check** that is hand-computable or visually inspectable;
- **Failure Signatures** and a debug ladder from shape/dtype through isolated tests to integration;
- three progressive hints: Concept, Invariant/Structure, Debug Strategy—collapsed and never a full solution;
- **Prediction → Controlled Experiment → Observation → Explanation** for empirical work;
- a **Gate** that summarizes capability without hard-locking later content.

Keep tests passing as Correct evidence, not the complete definition of understanding. Systems work needs profiles and measurement conditions; scaling work needs fit region/residual/uncertainty; data work needs population/filter/bias accounting; alignment work needs objective/proxy/exploit/evaluation evidence.

The Lesson → Assignment bridge must name the exact mechanism and the implementation decision it justifies. A link that says only “see Project 2” is not a bridge. Historical implementations may support invariant and bug analysis, but must be labeled as historical evidence rather than current official solutions.

When a learner-owned historical repository exists, use the distinct [Historical Implementation Recap profile](historical-implementation-recap.md). Do not force projects without personal code evidence into that profile; keep them as Engineering Workbooks.

## Problem identity and navigation

Preserve displayed official IDs exactly. Do not make a second manual mapping when the stage bank can drive the Problem Index.

If current verified localized statements exist, use stable anchors such as:

```text
train_bpe → #problem-train_bpe
```

Stage entries should open/focus the target, update the hash, apply restrained highlighting, and respect `prefers-reduced-motion`. Each problem links back to its Workbook stage; multiple stage memberships produce multiple backlinks rather than duplicate statements.

Unresolved status must be explicit: `Official only`, `Current statement verified`, `Historical archive`, or `Needs Review`. An ID match alone does not prove interfaces, tests, constraints, hardware, or deliverables match the current term.

## Disclosure depth

For a current publishable localization, the normal path is:

```text
中文完整题面 → individual problem details
```

Use at most one parent disclosure. A problem-internal advanced hint may add one more. Never require `Deep Reference → old guide → translated outline → problem`.

Historical archive pages may keep individual problems collapsed, but must show a prominent non-active label and a direct link back to the current Workbook.

## Official task vs CourseStack guidance

Visually separate instructor requirements from CourseStack prerequisites, implementation order, debugging suggestions, predictions, and hints. CourseStack scaffolds; it does not solve.

Allowed guidance includes checking shapes, mask direction, numerical stability, deterministic tiny inputs, profiling methodology, and experiment controls. Do not provide submit-ready code, fill official TODOs, or present an implementation recipe as a hint.

## Evidence discipline

Performance conclusions require baseline, configuration, hardware, dtype/shape, warmup, synchronization, repetition count, measurement method, result, and explanation. Experimental claims require hypothesis, controlled variables, observation, uncertainty, and a conclusion whose scope matches the evidence.

Do not write a naked speedup, quality gain, or reward increase as a universal fact.

## Validation

For existing courses, compare official IDs and any publishable localized IDs against the pre-change Git baseline. A refactor must not silently delete assets; moving historical content to an independent archive is valid only when the archive, return links, and regression checks exist.

Rendered QA should verify representative Stage flows for every Assignment:

- Task path and current official sources are reachable at the top;
- current IDs and source links resolve;
- stage navigation, gates, hints, and Lesson anchors work;
- verified localized statements, if present, open/focus and link back correctly;
- historical problems are absent from the active DOM and archives are clearly marked;
- desktop uses a readable main column plus at most one side navigation;
- mobile has no page-level horizontal overflow and long titles wrap;
- source/version labels describe the content actually shown.

When publishing, verify the public page and cache-busted assets rather than treating `git push` as deployment proof.
