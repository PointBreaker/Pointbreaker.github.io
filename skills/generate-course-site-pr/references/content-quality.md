# Course content quality policy

## Source hierarchy

Use sources in this order:

1. Downloaded official lecture slides, handouts, homework, labs, starter code, and official repositories.
2. The official course homepage and first-party university pages.
3. Original papers, standards, and official product/library documentation.
4. Reputable secondary explanations only to improve pedagogy after the primary claim is verified.

Respect task-specific source and network restrictions. Prefer complete local copies when the user identifies them as authoritative, and record unresolved resources rather than silently replacing them.

When the user supplies only a course URL, follow [source-discovery-and-migration.md](source-discovery-and-migration.md). An official link is sufficient to begin; local resources are optional evidence, not a prerequisite the user must assemble.

## Reconciliation rules

- Build one canonical schedule before drafting pages.
- Do not merge different years or terms implicitly. Label supplemental older/newer material and explain why it is used.
- Prefer the actual assignment handout over a schedule summary when requirements conflict.
- Prefer source code behavior over prose for version-sensitive APIs, while recording the relevant version or date.
- Recompute numerical examples and dimensional analysis. Never copy a slide arithmetic result without checking it.
- Verify paper title, author list, year, DOI/arXiv ID, and the claim attributed to it.
- Distinguish a simplifying teaching model from a production-system fact.
- State uncertainty locally and specifically; avoid vague disclaimers that hide an unsupported page.

## Lecture composition

Use this dependency order when it fits the source:

1. The actual problem the lesson resolves.
2. Prerequisite recovery and a compact object-relation map.
3. Main ideas organized by dependency, not slide order.
4. Toy examples and derivations before large-model or production claims.
5. Implementation consequences where official material supports them.
6. Common misconceptions, alternative designs, counterexamples, and boundary conditions.
7. Inline checks close to the mechanism plus optional cross-section validation.
8. Closed-book explanation prompts, course connections, and primary references.

Use concise Chinese explanations while retaining important English terms in parentheses on first use. Avoid bloating pages with generic history, motivational filler, or claims unrelated to the course sources.

Follow [lesson-learning-system.md](lesson-learning-system.md) for reasoning-gap audits, claim labels, practice behavior, reading hierarchy, and browser QA. Do not equate page length or repeated template headings with teaching depth.

## Visual and interactive explanations

- Create a visual only when it makes a relationship, state transition, geometry, comparison, or parameter effect materially easier to understand.
- Prefer semantic HTML/CSS or a static SVG for a fixed architecture, dataflow, tensor-shape map, or derivation overview; avoid large ASCII framework drawings when spatial relationships matter.
- Prefer the shared declarative interactive runtime for parameterized curves, matrices that change across frames, and step-by-step processes.
- Preserve quantitative values and attribution from official figures. Clearly label redrawn explanatory diagrams instead of presenting them as official originals.
- Require surrounding prose that explains what the learner should notice. A figure or simulator must not stand alone without interpretation.
- Follow [interactive-content.md](interactive-content.md) for schema, fallback, accessibility, safety, and performance requirements.

## Math and code

- Use `\(...\)` inline and `\[...\]` for display math.
- Never split identifiers with math delimiters. For example, write `<code>optimizer.zero_grad(set_to_none=True)</code>` as a single code node.
- Never use `$...$`, `$$...$$`, or LaTeX inside `<code>`/`<pre>`.
- Prefer built-in KaTeX commands. If official material relies on custom macros, define them once in the shared math runtime and include the macro in browser QA; never ship KaTeX's red unknown-command fallback.
- Check every symbol definition, tensor shape, unit, asymptotic condition, and numerical substitution.
- Keep code executable in spirit: use real APIs, specify version-sensitive behavior, and separate pseudocode from runnable examples.
- Wrap every code sample in `<pre><code class="language-...">`. Choose a precise Prism language; use `pseudocode` for structured algorithm notation and `plaintext` only for diagrams, transcripts, or intentionally unhighlighted text.

## Assignment guidance and localization rights

- Translate CourseStack-authored navigation, explanations, readiness prompts, contracts, debugging guidance, predictions, gates, and source-gap notices into natural Simplified Chinese. Keep an English technical term on first use when it improves precision.
- Publish complete localized problem statements only when the current source is verified and redistribution/localization is permitted or explicitly authorized. Public accessibility alone is not a redistribution license.
- When full republication is not permitted, write a clean-room Chinese Problem Guide and Engineering Workbook, preserve official IDs, and link the authoritative handout/repository for exact tasks and constraints. Do not reconstruct a copyrighted statement from fragments merely to make it “offline complete.”
- A CourseStack-authored equivalent exercise may be self-contained when pedagogically useful, but label it `站内等价练习` and never imply that it is the official problem.
- Preserve existing legitimately localized content, but distinguish current-term verification from ID matching. Older translations remain historical assets until interfaces, tests, constraints, hardware, and deliverables are checked.
- Do not expose solution keys. Hints identify a concept, invariant, or debugging strategy without revealing submit-ready implementation.
- Preserve original problem IDs exactly. Normalized aliases may support anchors only when displayed IDs remain unchanged.
- Follow [assignment-learning-system.md](assignment-learning-system.md) for active/current hierarchy, stage contracts, archive boundaries, navigation, and regression checks.

## Quiz contract

Use container answers:

```html
<div class="quiz" data-quiz="1" data-answer="b"
     data-correct="正确解释。" data-incorrect="指出关键误区。">
  <p><strong>问题：</strong>……</p>
  <div class="quiz-options">
    <button data-choice="a" aria-pressed="false">……</button>
    <button data-choice="b" aria-pressed="false">……</button>
    <button data-choice="c" aria-pressed="false">……</button>
  </div>
</div>
```

Make the correct choice unambiguous, ensure feedback explains why, and avoid answer choices that differ only stylistically.

## Resource redistribution

Do not copy PDFs, slide decks, homework archives, starter repositories, videos, or images into the public site by default. Link to the official public URL when redistribution is clearly allowed, or cite the local filename as a source without publishing it. Add an asset only when it is necessary for the explanation and its license or user authorization permits publication.
