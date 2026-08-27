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
