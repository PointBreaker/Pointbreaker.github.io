# Design QA · CourseStack Technical Studio

## Visual truth

- Selected reference: `/home/dax/.codex/generated_images/01a060d0-f087-7b22-b7fa-2f88d72cf48c/exec-261523bc-c701-443e-8ce2-3c4f6ef087ab.png`
- Reference dimensions: 1536 × 1024
- Primary implementation capture: `.course-build/screenshots/studio-v2/cs168-l6-1536.png`
- Implementation dimensions: 1536 × 1024
- Browser: Firefox, selected by the user in the existing workspace session
- State compared: CS168 Distance Vector learning workspace, desktop, initial interactive frame

## Comparison evidence

Full-view source and implementation were opened together, followed by focused comparisons of:

- `.course-build/screenshots/studio-v2/reference-top.png`
- `.course-build/screenshots/studio-v2/implementation-top.png`
- `.course-build/screenshots/studio-v2/reference-workspace.png`
- `.course-build/screenshots/studio-v2/implementation-workspace.png`

Additional implementation captures covered CS168 Dashboard, MIT 18.06, Stanford CS336, MIT 6.102, MIT 6.5840 Dashboard and Lesson, EECS498 Review Lab, and mobile states.

## Visible fidelity review

| Area | Reference contract | Final implementation | Severity |
| --- | --- | --- | --- |
| Global frame | Black compact top bar and edge-to-edge studio | 44 px black top bar; fixed rail and inspector | none |
| Left rail | Full grouped curriculum with current item and progress | Full course collection, semantic grouping, current state, progress | none |
| Main width | Broad technical workspace | Remaining viewport width is used; no legacy narrow centered column | none |
| Hierarchy | Compact breadcrumb, title, mode tabs, immediate workspace | Breadcrumb/title/tabs tightened; dedicated network trace begins immediately | none |
| Right rail | Persistent State / Table / Event inspection | Course-specific inspector or trace-specific live inspector | none |
| Density | Thin rules, small labels, compact tables | Reduced radii/shadows and compact typography/table spacing | none |
| Course semantics | Networking state model in the reference | Per-course Systems / Compute / Algorithm / Engineering / Reasoning profiles | none |
| Responsive | Desktop composition must degrade cleanly | 13-course 500 px matrix has no horizontal overflow | none |

## Comparison history

1. Initial implementation retained too much legacy page chrome, had a 54 px header, an oversized title block, narrow content, and bespoke 6.5840 / EECS498 surfaces outside the studio shell.
2. The shared shell was rebuilt around fixed 222 px / fluid / 316 px columns. 6.5840 and EECS498 were migrated; all Dashboard surfaces were rebuilt.
3. The final pass reduced the header to 44 px, tightened title/tabs spacing, removed redundant dedicated-interactive intro chrome, corrected the 6.102 invisible active source label, and corrected CS336’s course profile.

## Functional QA

- Course dashboard filters expose practice items and hide lecture items as expected.
- Dashboard inspector tabs update the active panel.
- Lesson inspector tabs update the active panel and expose a populated page table of contents.
- CS168 network trace advances from Round 0 to Round 1 and retains its live inspector.
- 6.102 switches between both/digest/official source views and exposes the Source boundary panel.
- Representative desktop and mobile matrices report no missing images and no horizontal overflow.
- JavaScript syntax checks pass for shared dashboard/lesson code and bespoke 6.102 / EECS498 code.
- Repository integrity and all course-specific content gates pass.

## Remaining findings

- P0: 0
- P1: 0
- P2: 0
- P3: 0

passed
