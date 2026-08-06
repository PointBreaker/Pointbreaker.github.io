# PointBreaker platform v2 design QA

- Desktop viewport: `1440 × 1024`
- Mobile viewport: `390 × 844`
- Screenshots: `/Users/dax/learning-records/output/design-qa-v2/`
- Pages inspected: homepage, four course Dashboards, lecture pages, assignment/Lab pages, formula-heavy lecture, generated test course
- Browser: Codex in-app Browser

## Evidence

- `home-desktop.png`: data-driven course library, search/filter controls, collection totals, and two-column course grid.
- `dashboard-cs336-desktop.png`: shared course hero, metadata, progress, filters, and lecture-to-assignment learning path.
- `lesson-cs267-desktop.png`: shared reading bar, editorial typography, metadata, table of contents, formulas, and content cards.
- `home-mobile.png`: homepage collapsed to one column with no clipped cards or controls.
- `lesson-cs267-mobile.png`: reading page at 390px with hidden desktop TOC, single-column pager, and horizontally safe formulas.

## Functional checks

- Homepage loads four records from `courses.json`; collection totals resolve to 4 courses, 95 lectures, and 32 practice guides.
- Search for `MPI` reduces the catalog to CS267 and updates the live result count.
- All four Dashboards load from `course-info.json` and `api/status.json` with the expected title, progress, and learning units.
- Dashboard and homepage filters are keyboard-addressable and preserve visible focus states.
- CS267 formula-heavy lecture renders 80 KaTeX expressions with zero KaTeX errors and zero console warnings/errors.
- Reading pages add course navigation, reading progress, automatic page TOC, code-copy controls, and previous/next navigation.
- A registered quiz answer reports correct feedback. Legacy quizzes without registered answers now show a neutral reference explanation instead of falsely marking every choice incorrect.
- The Skill-generated TEST101 fixture loads as a new course without hard-coded slug changes: 2 lectures, 1 Lab, working Dashboard, KaTeX, pager, and no console errors.

## Layout checks

- Homepage desktop horizontal overflow: `0px`.
- Four Dashboard desktop horizontal overflow: `0px`.
- Formula-heavy lecture desktop horizontal overflow: `0px`.
- Homepage and lecture mobile horizontal overflow: `0px`.
- Mobile course cards, metadata pills, tables, formulas, code blocks, and pager remain inside the viewport.
- Desktop reading TOC is removed below its breakpoint; mobile content retains the full heading hierarchy.

## Content and link checks

- All local `href` and `src` references resolve.
- No published page contains Google Drive or Google Docs URLs.
- No visible unsupported `$...$` math remains.
- Inline and display math delimiters are balanced across all four courses.
- The reported `optimizer.zero_grad(set_to_none=True)` example remains a single code node and renders without math splitting.

## Community refinement

- Dashboard learning units no longer use pure-white raised cards; computed `.path-unit` background is transparent with no shadow or radius.
- The flattened learning path passes at desktop and `390 × 844` with `0px` horizontal overflow.
- Every lecture and practice page mounts a unique Giscus term from its stable course-relative path.
- Before the Giscus App is authorized, the page shows a styled GitHub Discussions fallback instead of the provider error frame.

## Result

No actionable P0, P1, or P2 design findings remain.

final result: passed
