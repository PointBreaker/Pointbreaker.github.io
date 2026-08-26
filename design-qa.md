# CS336 textbook experience design QA

- Date: `2026-08-27`
- Browser: headless Firefox through WebDriver
- Desktop viewport request: `1440 × 1000` (page screenshot content: `1440 × 914`)
- Mobile viewport request: `390 × 844` (Firefox minimum screenshot width: `500`, content height: `758`)
- Pages inspected: all 19 CS336 lessons; focused visual review on Lessons 2, 10, and 12

## Visual truth and comparison evidence

- Source visual truth: the existing CourseStack lesson UI captured before this change at `/tmp/cs336-before-l2.png`, plus the user's two-column textbook wireframe and requirements in the task brief.
- Implemented desktop screenshot: `/tmp/cs336-final-l2-top.png`.
- Full-view before/after comparison: `/tmp/cs336-final-compare-l2.png`.
- Focused Concept Check state: `/tmp/cs336-final-l2-concept-element.png`.
- Focused four-level Deep Quiz state: `/tmp/cs336-final-l10-quiz-element.png`.
- Mobile lesson directory state: `/tmp/cs336-final-l12-mobile.png`.

The combined comparison was inspected as one image. The implementation preserves CourseStack's serif editorial typography, warm paper background, dark global header, green accent, and flat surfaces. The redesign reduces hero height, places the knowledge map and learning outcomes side-by-side, limits the reading column to about 820px, and adds a 200–230px sticky lesson TOC without introducing a third navigation column.

## Layout and visual findings

- All 19 lessons mount exactly one compact hero and one textbook reading shell.
- Desktop lessons use the intended main-column plus right-TOC layout. The TOC contains 7–8 high-value anchors rather than every subheading, so it remains navigable on long pages.
- At the mobile breakpoint, the desktop TOC is removed and the same anchors appear in a collapsible `本课目录` block above the text.
- All 19 lessons report `0px` page-level horizontal overflow at desktop. The representative mobile page also reports `0px` overflow.
- Hero outcomes are capped at four; source/version notes are available in a collapsed disclosure rather than occupying the first viewport.
- `Mental Model`, `Derivation`, `Misconception`, `Concept Check`, and `Deep Dive` use labels, borders, and typography rather than five saturated card styles.
- Concept checks and Deep Quiz remain visually distinct but flat. Ordinary explanatory prose is not wrapped in cards.
- Deep Dive sections are closed by default; closed-book prompts keep their reference answers behind disclosure controls.

## Interaction checks

- All 19 lessons render 4 inline Concept Checks, 5 lesson-end Deep Quiz questions, and 3 open explain-it-yourself prompts.
- The Deep Quiz visibly covers four levels: Understand, Distinguish, Derive, and Transfer.
- A deliberately wrong BPE answer displayed the selected option's misconception, the correct reasoning, explanations for all four options, and a second question using the same mental model in a different surface form.
- Retry cleared the selected radio, removed the explanation, hid itself, and restored the submit action.
- Legacy quizzes are hidden after the new practice system mounts, avoiding duplicate end-of-lesson assessment.
- Mobile lesson TOC opens correctly and exposes the same eight anchors as desktop on the tested lesson.
- WebDriver and page scripts produced no page-level JavaScript error during the 19-page sweep. Firefox emitted only browser-internal Nimbus/new-tab warnings unrelated to CourseStack.

## Iterations made from visual QA

1. The first sidebar contained too many heading links; it was reduced to prerequisite, four core anchors, Deep Quiz, open practice, and the closing capability checklist.
2. The first hero remained too tall; the secondary summary was removed from the rendered hero, source notes became a disclosure, and visible outcomes were capped at four.
3. The first mobile pass showed that a permanent sidebar would be too dense; it now becomes a compact top disclosure while the lesson pager remains visible.

## Result

No actionable P0, P1, or P2 design findings remain.

final result: passed
