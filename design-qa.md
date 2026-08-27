# CS336 Engineering Workbook design QA

- Date: `2026-08-27`
- Browser: headless Firefox through WebDriver
- Desktop viewport request: `1440 × 914` (page screenshot content: `1440 × 828`)
- Mobile viewport request: `500 × 758` (page screenshot content: `500 × 672`)
- Pages inspected: all 5 Assignment workbooks and all 19 Lessons

## Visual truth and comparison evidence

- Source visual truth: existing CourseStack Assignment UI captured before this change at `/tmp/cs336-ass01-basics-before-desktop.png`, plus the user's Engineering Workbook structure and CourseStack's established warm-paper / dark-green editorial system.
- Final Assignment 1 desktop: `/tmp/cs336-ass01-final2-desktop.png`.
- Same-state before/after comparison: `/tmp/cs336-ass01-before-after-final2.png`.
- Focused Stage / Contract state: `/tmp/cs336-ass01-final2-stage.png`.
- Focused Assignment 2 mobile state: `/tmp/cs336-ass02-final2-mobile.png`.
- Lesson adaptive Concept Check result: `/tmp/cs336-lesson01-followup-final2.png`.

The before and after captures were combined and inspected as one equal-size image. The new UI preserves the existing serif headings, warm paper background, dark global header, green accent, restrained rules and flat surfaces. The Assignment hero remains recognizably CourseStack while the first reading viewport now establishes official version boundaries instead of opening directly into a long handout.

## Assignment layout findings

- All five pages render the expected 29 stages: `4 / 6 / 5 / 6 / 6`.
- Desktop uses a main workbook column plus a 200–220px sticky Stage navigation. The focused Stage capture shows the intended sequence without a dashboard-like card wall: Stage goal, build / why, Lesson links, readiness, Contract, then evidence work.
- Mobile is one column. Stage navigation becomes a horizontally scrollable sticky row below the global header; the inner nav is scrollable while the page itself has no horizontal overflow.
- Contract, Definition of Done and experiment grids collapse to a single column at the mobile breakpoint.
- Hints, readiness, failure diagnostics and Deep Reference are closed by default, reducing long-page density and layout shifts.
- The official / legacy hierarchy is visible at the top: official version, workbook basis, legacy or optional boundary, and cloned official source links.
- The old Chinese guide, knowledge tree, Cheatsheet, official handout and legacy supplement remain available in `Deep Reference`; no valuable source material was deleted.

## Interaction and regression checks

- Desktop runtime counts match the data bank on every Assignment: stages, gates, contracts, sanity checks, failure signatures, three-level hints, experiments and Lesson links.
- All five Assignment pages report no page-level horizontal overflow on desktop or mobile.
- Every Hint and the full Deep Reference are closed by default.
- Gate checkboxes update both local `0 / 5` progress and assignment-level capability progress; they do not hard-lock later stages.
- Lesson 1–16 each show one exact `Learn → Build → Return` bridge to a matching workbook stage; Lessons 17–19 intentionally show none.
- On a correct Lesson answer, Follow-up becomes a closed optional `再验证一次` disclosure. On a wrong answer, diagnosis and Follow-up are automatically visible.
- Assignment mobile stage nav has `overflow-x: auto` on the inner navigation element; all long identifiers stay inside local containers.
- Browser runs produced no page-level JavaScript errors. Firefox emitted only browser-internal Nimbus/new-tab warnings unrelated to CourseStack.

## Iterations made from visual QA

1. The first Assignment hero repeated too much guide copy; it was shortened to the Engineering Workbook mission and the version boundary became a compact strip.
2. The original guide body competed with the workbook flow; it was preserved but moved into a default-collapsed Deep Reference.
3. Generic CourseStack `h2` margins introduced about 78px of hidden spacing inside every stage. Assignment-specific heading rules now override that spacing, materially shortening long pages.
4. Mobile retained the desktop sidebar in the first layout pass; it now becomes a horizontal, sticky stage navigator with no page overflow.
5. Assignment 5 initially risked presenting SFT / DPO as the Spring 2026 core path; it is now visibly separated as an optional safety / preference supplement after the reasoning-RL stages.

## Result

No actionable P0, P1 or P2 design findings remain.

final result: passed
