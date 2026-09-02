# Course reading-flow contract

Apply this after the core content is accurate and deep enough, including the Gold Standard lesson review. Its purpose is to make the course read like one continuous technical textbook without adding more topics. Reading flow cannot compensate for shallow content, and depth work does not authorize a wall of cards.

## One active narrative

The selected current term is the only active curriculum. Learners should not need to decide whether a paragraph, problem, interface, or benchmark belongs to the current course.

Older material has only three valid destinations:

1. still correct and useful → merge naturally into the current explanation without a legacy label;
2. useful for understanding evolution → compress to a 1–3 paragraph Historical Note;
3. retired requirement/version record → independent archive or migration report, outside the active flow.

Never place a complete prior course, old handout, or many obsolete problems inside a giant `Legacy supplement` disclosure on the active page.

## Lecture opening

The first viewport should quickly answer “what problem does this chapter solve?” A useful order is:

```text
title + one-sentence lede
compact source line
core question
30-second mental model
only the necessary prerequisite recovery
main teaching section
```

Do not stack separate source, bridge, learning-map, contract, object-map, worked-example, and misconception cards before the first real section. Merge repeated purpose statements. Avoid duplicating end-of-lesson outcomes in the hero.

## Main teaching flow

Prefer ordinary headings, paragraphs, equations, code, tables, and diagrams. Reserve boxed emphasis for Mental Model, Misconception/Warning, and Concept Check.

- Put a worked example after the learner has the minimum mechanism needed to interpret it, unless the example deliberately poses the opening problem.
- Keep required concepts in the main flow. Deep Dive is only for optional derivations, framework variants, hardware history, paper-specific detail, and advanced edge cases.
- Remove repeated explanations before hiding them in `<details>`.
- Keep each lesson's main question visible in the section sequence; do not turn the page into a collection of independent notes.
- End with a short `Next` connection that explains why the following lecture is the natural next step.

## Visual hierarchy

CourseStack is a browser textbook, not a dashboard.

- Avoid card walls, repeated badges, multiple high-saturation callouts, and one border per paragraph.
- Use a readable main column. Desktop may add one narrow sticky lesson TOC; never show a global TOC and lesson TOC as competing columns.
- Mobile may use a collapsed/scrollable version of the same TOC data, but only one TOC should be visible per viewport.
- Source provenance should be a compact line or disclosure. Commits, checked dates, exact versions, and source boundaries remain available without dominating the opening.
- Code, shapes, math, and tables scroll locally on narrow screens; the page itself must not overflow horizontally.

## Diagrams

Use a semantic HTML/CSS or static SVG diagram when the learner must understand architecture, ownership, hierarchy, topology, repeated mappings, state transitions, tensor shapes, or a multi-stage dataflow. Use consistent nodes, arrows, labels, grouping, and responsive stacking.

ASCII is suitable only for a compact inline pipeline or terminal-like example. Replace large ASCII “framework diagrams” when spatial structure materially matters. A visual must have a caption or adjacent prose explaining what to notice and must remain understandable without color.

Avoid decorative diagrams and image generation for relationships that repository-native HTML/CSS/SVG can express more clearly.

## Assignment flow

The active page should prioritize:

```text
Mission
→ what you will build
→ dependency-first stages
→ current problem guide / official IDs
→ debugging and evidence
→ gates and retrospective
→ official sources
```

Version history is not the task path. Keep a current-term problem guide current, and compress older deltas to a short note or independent archive. Do not load hundreds of legacy problem nodes into the active DOM merely to hide them at runtime.

## Length control

During the reading-flow pass, target neutral or reduced word count. Prefer, in order:

1. delete duplication;
2. merge adjacent explanations;
3. shorten provenance and history;
4. move retired material to archive;
5. collapse only truly optional detail.

Do not use `<details>` as a substitute for deciding that content no longer belongs.

## Runtime and regression audit

Inspect source and rendered DOM because a shared renderer may create duplicate TOCs, move nodes, hide a lede, nest disclosures, or reinsert archive content.

Verify:

- exactly one visible TOC at desktop and mobile widths;
- direct anchors land below sticky navigation;
- source disclosures remain usable with keyboard and reduced motion;
- no required mainline content is hidden by default;
- examples and misconceptions appear next to the mechanism they test;
- current Assignment pages do not rebuild archived problem DOM;
- archive links are explicit, reversible, and clearly outside the active curriculum;
- page routes, progress keys, quiz state, and cross-links survive restructuring;
- no console errors or page-level horizontal overflow.

Do not report a visual or rendered behavior as verified when only static source or regex lint was checked.
