# Render QA

Use this after authored content passes the depth review. Source HTML validation is necessary but cannot prove rendered correctness.

## Static checks

- Validate exactly one `h1`, stable heading IDs, local links, cache-busted shared assets, quiz answer mappings, interactive specs/fallbacks, and code language classes.
- Reject control characters introduced by incorrectly escaped strings, unsupported dollar delimiters, unbalanced `\(...\)` / `\[...\]`, and obvious raw LaTeX commands outside math containers.
- Parse every JSON spec and SVG. SVGs must have accessible names and no scripts, foreign objects, or embedded remote resources.

## Browser checks

Serve the site and wait for asynchronous course metadata and interactives to finish loading. Inspect both the visible page and runtime DOM.

For representative pages in every changed family, verify:

- KaTeX creates `.katex` nodes, reports no `.katex-error`, and visibly renders the intended inequality, fraction, subscript, Greek letter, or matrix;
- inline and display formulas keep the intended grouping and do not expose raw commands;
- Prism/code blocks preserve whitespace and scroll locally;
- every quiz can exercise both a wrong and correct path, announces feedback with `role=status`, and maps distractors to real misconceptions;
- every interactive loads its JSON, replaces or supplements the fallback as designed, changes state under pointer and keyboard input, and teaches the relationship named in surrounding prose;
- the fallback is meaningful when JavaScript or JSON loading is disabled;
- previous/next, course, Assignment, source, and direct-anchor links reach the intended targets;
- desktop and mobile have no page-level horizontal overflow, clipped heading, hidden required content, duplicate TOC, or Discussion-drawer collision;
- focus indicators are visible and reduced-motion mode does not require animation to understand a transition.

Do not infer network failures from `PerformanceResourceTiming.duration === 0`; cached resources may report zero. Check response status, DOM outcome, and browser console together.

## Formula sampling is not enough for a known bug

If one malformed formula is found, scan every lesson in that course for delimiters, control characters, raw command fragments, and related generated strings. Then render every page containing math, not only the original failure.

Record the exact pages and viewports tested. If browser control or screenshots are unavailable, report `render not verified`; never replace browser evidence with a source regex and call it complete.

