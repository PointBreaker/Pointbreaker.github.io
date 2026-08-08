# Course content quality policy

## Source hierarchy

Use sources in this order:

1. Downloaded official lecture slides, handouts, homework, labs, starter code, and official repositories.
2. The official course homepage and first-party university pages.
3. Original papers, standards, and official product/library documentation.
4. Reputable secondary explanations only to improve pedagogy after the primary claim is verified.

Respect task-specific source and network restrictions. Prefer complete local copies when the user identifies them as authoritative, and record unresolved resources rather than silently replacing them.

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

Use this structure when it fits the source:

1. Course/lecture eyebrow, title, lede, instructor/time/difficulty metadata.
2. Learning objectives and prerequisite recap.
3. Conceptual map of the lecture.
4. Main ideas organized by dependency, not slide order.
5. Derivations, algorithms, systems diagrams, or worked examples.
6. Implementation notes or code where the official material supports them.
7. Common misconceptions and boundary conditions.
8. Two to five quizzes that test understanding, not trivia.
9. Summary and primary references.

Use concise Chinese explanations while retaining important English terms in parentheses on first use. Avoid bloating pages with generic history, motivational filler, or claims unrelated to the course sources.

## Visual and interactive explanations

- Create a visual only when it makes a relationship, state transition, geometry, comparison, or parameter effect materially easier to understand.
- Prefer a static SVG for a fixed architecture, dataflow, tensor-shape map, or derivation overview.
- Prefer the shared declarative interactive runtime for parameterized curves, matrices that change across frames, and step-by-step processes.
- Preserve quantitative values and attribution from official figures. Clearly label redrawn explanatory diagrams instead of presenting them as official originals.
- Require surrounding prose that explains what the learner should notice. A figure or simulator must not stand alone without interpretation.
- Follow [interactive-content.md](interactive-content.md) for schema, fallback, accessibility, safety, and performance requirements.

## Math and code

- Use `\(...\)` inline and `\[...\]` for display math.
- Never split identifiers with math delimiters. For example, write `<code>optimizer.zero_grad(set_to_none=True)</code>` as a single code node.
- Never use `$...$`, `$$...$$`, or LaTeX inside `<code>`/`<pre>`.
- Check every symbol definition, tensor shape, unit, asymptotic condition, and numerical substitution.
- Keep code executable in spirit: use real APIs, specify version-sensitive behavior, and separate pseudocode from runnable examples.

## Assignment localization and offline completeness

- Translate all student-facing titles, instructions, statements, subparts, hints, checks, and source-gap explanations into natural Simplified Chinese. Keep an English technical term in parentheses only when it improves precision.
- Require a learner to be able to answer every displayed problem without opening an external URL, textbook, PDF, slide deck, or image. Include all numerical data, formulas allowed by the problem, matrix entries, domains, intervals, units, graph coordinates, and diagram relationships in the page.
- Classify each displayed problem as one of: `官方题面翻译`, `依据本地资料重建`, or `站内等价练习`. Show the classification and a `可离线作答` marker in the UI.
- Use `依据本地资料重建` only when downloaded handouts, local solution text, or other local first-party evidence supports the full conditions. Do not copy final answers into the reconstructed statement.
- Use `站内等价练习` when the official handout contains only a textbook/problem number and local evidence cannot recover the complete wording. Create a self-contained exercise that tests the same source-backed topic and expected technique, and state clearly that it is not the official original.
- Never leave directions such as “see the textbook,” “refer to the figure,” or “open the source PDF.” Replace missing figures with sufficient coordinates, matrices, labeled relationships, or a locally owned redrawn diagram.
- Preserve an existing human-written guide. Generated problem extraction must live between dedicated markers and may replace only that region. A work-item page must contain both a guide and a complete problem outline.
- Do not expose solution keys. Hints should identify an entry point, and checks should validate dimensions, units, signs, boundary behavior, or substitution without revealing the final result.

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
