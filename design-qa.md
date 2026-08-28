# CS336 Assignment 中文题面恢复 design QA

- Date: `2026-08-27`
- Browser: headless Firefox through WebDriver
- Desktop viewport request: `1440 × 914` (page screenshot content: `1440 × 828`)
- Mobile viewport request: `500 × 758` (page screenshot content: `500 × 672`)
- Pages inspected: Assignment 1–5

## Visual truth and comparison evidence

- Source visual truth: previous CourseStack Assignment rendering captured before this change at `/tmp/cs336-ass01-localization-before-top.png` and `/tmp/cs336-ass01-localization-before-reference.png`.
- Final focused problem state: `/tmp/cs336-ass01-localization-finalk-train-bpe.png`.
- Final Assignment 2 mobile localization state: `/tmp/cs336-ass02-localization-finalk-mobile.png`.
- Same-viewport before/after comparison: `/tmp/cs336-ass01-localization-finalk-compare.png`.
- Additional final captures inspected: `/tmp/cs336-ass01-localization-final-section.png` and `/tmp/cs336-ass01-localization-final-official.png`.

The combined comparison confirms that the established CourseStack visual language remains intact: warm paper background, dark global header, serif editorial headings, green accent, restrained borders and flat surfaces. The material change is information hierarchy: the previous end-of-page `Deep Reference` path is replaced by a same-level `完整中文题面` resource with a version notice, coverage summary and stage-grouped problem index.

## Information architecture findings

- All five pages expose three peer resources: `Engineering Workbook`, `中文完整题面`, and `Official Handout`.
- All 118 localized problems render inside the first-class localization section: `39 / 22 / 3 / 14 / 43`.
- No `.problem-row` remains inside `Deep Reference`.
- Assignment 2 and 5 translated outlines were detached from their old `Legacy Supplement <details>` wrappers. A problem now has no folding ancestor between it and the localization section.
- `Deep Reference` contains only secondary guide, knowledge-tree, Cheatsheet, legacy and historical material.
- Official repository, README, PDF and schedule links stay visible in the independent Official Handout section.
- Version language visibly distinguishes Spring 2025 localized text from Spring 2026 workbook mappings and explicitly states that ID matching is not interface verification.

## Interaction and regression checks

- Workbook problem links and Problem Index entries resolve to stable `#problem-<id>` anchors.
- Tested direct links: Assignment 1 `train_bpe`, Assignment 2 `flash_forward`, Assignment 3 `scaling_laws`, Assignment 4 `minhash_deduplication`, Assignment 5 `dpo_loss`.
- Following a problem link opens its `<details>`, focuses the summary, applies a short target highlight and updates the hash.
- Every matched problem exposes a backlink to its Workbook Stage. Multi-stage research problems keep multiple backlinks without duplicating the translated statement.
- The right navigation switches correctly from stages to `中文完整题面`, `Official Handout`, and `Deep Reference` as the user scrolls.
- Desktop retains one content column plus the existing sticky 200–230px stage navigation; no third column was introduced.
- Mobile uses one column, a horizontally scrollable stage row and a one-column problem index. Long Chinese titles wrap naturally.
- All five pages have no page-level horizontal overflow on desktop or mobile.
- Motion behavior respects `prefers-reduced-motion`.

## Iterations made from visual QA

1. The previous renderer moved every old node into `Deep Reference`; nodes are now classified semantically as translated problems, official source content, legacy guide, legacy supplement or miscellaneous reference.
2. Assignment 2 and 5 had nested disclosure layers around complete translated handouts; the translated outlines are now direct children of the first-class localization section.
3. The initial mobile anchor offset combined two sticky-header margins and left excessive empty space; the problem scroll margin was reduced to keep the target visible directly below navigation.
4. Intersection-based stage highlighting could leave `Stage 06` active after entering resources; scroll-position navigation now activates the current top-level resource reliably.
5. A matched ID initially appeared to imply 2026 compatibility; the badge now reads `2026 ID Matched · Needs Review`.

## Required surface review

- Typography: existing CourseStack fonts, hierarchy and line lengths preserved.
- Spacing: localization section, notice, index and problem rows use the existing editorial rhythm; no card wall introduced.
- Color: existing dark green and low-saturation green only; version warnings rely primarily on labels, borders and type.
- Copy: Chinese resource titles are first-class; version/source wording avoids presenting Spring 2025 localization as Spring 2026 official translation.
- Assets: no new image or icon assets were required for this information-architecture repair.

## Result

No actionable P0, P1 or P2 design findings remain.

final result: passed

---

# CS336 / CS267 single-TOC + semantic framework diagrams design QA

- Date: `2026-08-27`
- Browser: headless Firefox through WebDriver
- Desktop viewport request: `1600 × 900`
- Mobile viewport request: `500 × 900`
- Pages covered by shared diagram assets: 46 lesson pages

## Navigation finding and fix

- The duplicate rail was reproduced on CS267 lessons and workbooks: shared `lesson-ui.js` generated `.pb-toc`, while the course learning layer generated `.lesson-toc` or `.workbook-side`.
- CS267 now keeps the course-aware navigation and suppresses the redundant generic rail. CS336's existing single-TOC protection remains intact.
- Runtime checks confirmed one visible rail on CS267 Lesson 16, CS267 Homework 1 and CS336 Lesson 3.

## Diagram system

- 29 high-value ASCII framework sketches now render as semantic HTML/CSS figures: 19 in CS336 and 10 in CS267.
- Layouts include connected flows, comparison lanes, object cards, memory hierarchies, dependency trees and a CSS Roofline chart.
- Original text diagrams remain available in a collapsed `查看文本版 / 精确符号` fallback; they are no longer the primary visual.
- The renderer uses page-scoped, exact source markers, so formula/code blocks that merely contain arrows are not transformed accidentally.

## Visual and responsive evidence

- Before captures: `/tmp/cs336-framework-before.png`, `/tmp/cs267-framework-before.png`.
- Final desktop captures: `/tmp/cs336-framework-after.png`, `/tmp/cs267-framework-after.png`, `/tmp/cs267-roofline-after.png`.
- Final mobile captures: `/tmp/cs336-framework-mobile.png`, `/tmp/cs267-framework-mobile.png`.
- Desktop diagrams align with the reading column and preserve the existing warm-paper, green-accent editorial language.
- Mobile flow diagrams collapse vertically; tree diagrams scroll inside their own viewport. Tested pages have no page-level horizontal overflow.

## Regression coverage

- Dedicated lint checks asset loading on all 46 lesson pages, all 29 diagram definitions, semantic layout styles, and preserved text fallbacks.
- CS267 content lint now asserts the single-TOC rule for both lessons and workbooks.
- Runtime rendering verified every diagram target; responsive smoke checks covered flow, tree and Roofline layouts.

## Result

No actionable P0, P1 or P2 visual, interaction or responsive findings remain.

final result: passed

---

# MIT 6.1810 semantic OS diagrams design QA

- Date: `2026-08-28`
- Browser: headless Firefox through WebDriver
- Desktop viewport request: `1600 × 900`
- Mobile viewport request: `500 × 900`
- Pages smoke-tested: 23 / 23 Lessons

## Scope and visual result

- All 23 lessons now expose at least one semantic HTML/CSS mental-model diagram; core lessons add a second mechanism diagram, for 28 diagrams total.
- Coverage includes the protected-kernel stack, process address space, microkernel IPC, Sv39 translation, syscall entry/return, lazy allocation and COW, TLB reach, interrupts, atomic locks, context switches, lost wakeups, networking, filesystem layers, WAL/journal recovery, RCU, nested page tables, BPF verification and Meltdown.
- Existing code, GDB transcripts, calculations and exact text layouts remain code blocks. Replaced ASCII frameworks retain a collapsed `查看文本版 / 精确符号` fallback.
- The existing generic lesson TOC was verified as the only navigation rail; 6.1810 did not have the duplicate-TOC bug found in CS267.

## Browser evidence

- Desktop captures: `/tmp/mit1810-page-table-desktop.png`, `/tmp/mit1810-syscall-desktop.png`, `/tmp/mit1810-wal-desktop.png`, `/tmp/mit1810-meltdown-desktop.png`.
- Mobile captures: `/tmp/mit1810-syscall-mobile.png`, `/tmp/mit1810-context-mobile.png`, `/tmp/mit1810-fs-stack-mobile.png`.
- Desktop diagrams stay inside the reading column beside the single shared TOC.
- Mobile flows collapse vertically, lanes remain clearly separated, and stack diagrams keep readable labels without page-level horizontal scrolling.
- All 23 pages rendered their expected diagram count with zero page-level horizontal overflow at both tested viewports.

## Technical QA

- TLB hit and miss are rendered as separate paths so a page-table walk is not implied on every access.
- COW separates shared read-only mappings from the allocating writer path.
- Atomic ownership and aq/rl memory ordering are distinguished in the lock diagram.
- WAL ordering explicitly remains `log data → commit point → install`.
- RCU separates pointer publication, grace period and reclamation.
- Meltdown distinguishes rolled-back architectural state from persistent cache state.
- Shared diagram lint now covers 57 diagrams across 69 CS336, CS267 and MIT 6.1810 lesson pages.

## Result

No actionable P0, P1 or P2 visual, interaction or responsive findings remain.

final result: passed

---

# CS267 Interactive Textbook + Engineering Workbook design QA

- Date: `2026-08-27`
- Browser: headless Firefox through WebDriver
- Desktop comparison viewport: `1440 × 914` (content screenshot `1440 × 828`)
- Mobile viewport: `500 × 844` (content screenshot `500 × 758`)
- Pages smoke-tested: 27 Lessons + 6 Homeworks + Final Project

## Visual truth and comparison evidence

- Existing CourseStack pages were used as the visual source of truth; no new palette, typography, hero, imagery or icon system was invented.
- Lesson 03 before/after source captures: `/tmp/cs267-before-lesson03-top.png`, `/tmp/cs267-after-lesson03-top-1440.png`.
- Same-viewport Lesson comparison: `/tmp/cs267-compare-lesson03.png`.
- Homework 1 before/after source captures: `/tmp/cs267-before-hw1-top.png`, `/tmp/cs267-after-hw1-top-1440.png`.
- Same-viewport Homework comparison: `/tmp/cs267-compare-hw1.png`.
- Focused Concept Check: `/tmp/cs267-after-lesson03-check2.png`.
- Mobile Workbook: `/tmp/cs267-after-hw1-mobile.png`.

Combined images confirm that the warm paper surface, dark global header, editorial serif hierarchy, green accent and restrained borders remain intact. The material changes are instructional hierarchy, a two-column long-reading shell, and first-class Workbook/source navigation.

## Lesson findings

- The 30-second knowledge map starts below the existing hero instead of increasing the hero's visual weight.
- Desktop uses one readable main column plus a 200–230px sticky lesson TOC; there is no third rail.
- Concept Check is visually distinct but uses a quiet green tint and border rather than a dashboard-style card wall.
- Wrong answers auto-reveal diagnosis and follow-up; correct answers expose only an optional disclosure.
- Existing quizzes are preserved in one collapsed quick-review disclosure.
- All 27 lessons render their learning layer; Lesson 24's malformed suffix-array code closing tag was fixed after visual/runtime QA exposed swallowed content.

## Assignment findings

- Existing dark green assignment banner remains the visual anchor.
- Source/version notice and the three peer resources appear directly after the banner.
- Workbook stages preserve normal document reading; Contract, sanity check, failure signatures, hints and Gate use a small, consistent visual vocabulary.
- Chinese task mappings are a first-class section and not nested under Deep Reference.
- Desktop stage navigation stays within a 220px rail; mobile removes the rail and keeps only component-level horizontal scrolling.
- Original Chinese guide content remains visible after the task mapping instead of being moved into a disclosure.

## Interaction and responsive checks

- Full browser smoke result: 27 / 27 lesson renderers and 7 / 7 workbook renderers initialized.
- Every page tested at 1280px has no page-level horizontal overflow.
- Homework 1 at 500px has no page-level horizontal overflow; primary navigation and stage map scroll locally.
- Stage → Chinese task opens the matching problem disclosure.
- Gate checkboxes persist only local capability state and do not lock navigation.
- No new image asset was required; the experience is information-architecture and typography driven.

## Result

No actionable P0, P1 or P2 visual, interaction or responsive findings remain.

final result: passed
