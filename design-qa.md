# Design QA · CourseStack Technical Studio

## Visual truth

- Selected reference: `/home/dax/.codex/generated_images/01a060d0-f087-7b22-b7fa-2f88d72cf48c/exec-261523bc-c701-443e-8ce2-3c4f6ef087ab.png`
- Reference dimensions: 1536 × 1024
- Primary implementation capture: `.course-build/screenshots/studio-v2/cs168-l6-1536.png` (recaptured after the 2026-09-05 inspector/header pass)
- Implementation dimensions: 1536 × 1024
- Browser: Firefox, selected by the user in the existing workspace session
- State compared: CS168 Distance Vector learning workspace, desktop, initial interactive frame

## Comparison evidence

Full-view source and implementation were opened together, followed by focused comparisons of:

- `.course-build/screenshots/studio-v2/reference-top.png`
- `.course-build/screenshots/studio-v2/implementation-top.png`
- `.course-build/screenshots/studio-v2/reference-workspace.png`
- `.course-build/screenshots/studio-v2/implementation-workspace.png`

Additional implementation captures covered CS168 Dashboard, MIT 18.06, Stanford CS336, MIT 6.102, MIT 6.5840 Dashboard and Lesson, EECS498 Review Lab, the CourseStack library, and mobile states. The latest focused captures are `.course-build/screenshots/studio-v3-cs336.png`, `.course-build/screenshots/studio-v3-cs168-dashboard.png`, and `.course-build/screenshots/studio-v3-home.png`.

## Visible fidelity review

| Area | Reference contract | Final implementation | Severity |
| --- | --- | --- | --- |
| Global frame | Black compact top bar and edge-to-edge studio | 44 px black top bar; fixed rail and inspector | none |
| Left rail | Full grouped curriculum with current item and progress | Full course collection, semantic grouping, current state, progress | none |
| Main width | Broad technical workspace | Remaining viewport width is used; no legacy narrow centered column | none |
| Hierarchy | Compact breadcrumb, title, mode tabs, immediate workspace | Breadcrumb/title/tabs tightened; dedicated network trace begins immediately | none |
| Right rail | Persistent State / Table / Event inspection | CS168 trace inspector is fixed to the viewport and exposes three working state modes | none |
| Density | Thin rules, small labels, compact tables | Reduced radii/shadows and compact typography/table spacing | none |
| Course semantics | Networking state model in the reference | Per-course Systems / Compute / Algorithm / Engineering / Reasoning profiles | none |
| Responsive | Desktop composition must degrade cleanly | 13-course 500 px matrix has no horizontal overflow | none |

## Comparison history

1. Initial implementation retained too much legacy page chrome, had a 54 px header, an oversized title block, narrow content, and bespoke 6.5840 / EECS498 surfaces outside the studio shell.
2. The shared shell was rebuilt around fixed 222 px / fluid / 316 px columns. 6.5840 and EECS498 were migrated; all Dashboard surfaces were rebuilt.
3. The final pass reduced the header to 44 px, tightened title/tabs spacing, removed redundant dedicated-interactive intro chrome, corrected the 6.102 invisible active source label, and corrected CS336’s course profile.
4. User review identified two remaining structural mismatches: CS336 duplicated its own `ON THIS PAGE` beside the shared Table panel, while CS168's trace inspector remained embedded in the content card. The duplicate CS336 TOC was removed and its main column widened to 930 px; the CS168 inspector was fixed to the right edge and gained working State / Table / Event panels. The global library and every course header were then aligned to the same 44 px Technical Studio frame.

## Functional QA

- Course dashboard filters expose practice items and hide lecture items as expected.
- Dashboard inspector tabs update the active panel.
- Lesson inspector tabs update the active panel and expose a populated page table of contents.
- CS168 network trace advances from Round 0 to Round 1 and retains its live inspector.
- CS168 State / Table / Event tabs switch panels; the Table view exposes three current route tables in the verified frame.
- CS336 has no visible course-local TOC, retains the shared right-hand Table control, and exposes a 930 px lesson main column.
- The CourseStack library filter rail works on desktop and becomes a horizontal, scrollable filter bar on mobile.
- 6.102 switches between both/digest/official source views and exposes the Source boundary panel.
- Representative desktop and mobile matrices report no missing images and no horizontal overflow.
- JavaScript syntax checks pass for shared dashboard/lesson code and bespoke 6.102 / EECS498 code.
- Repository integrity and all course-specific content gates pass.

## Remaining findings

- P0: 0
- P1: 0
- P2: 0
- P3: 0

final result: passed
