# Solution-bearing coursework

Use these rules when local official discussion or homework solutions are available and the user explicitly authorizes publishing them.

## Pairing and completeness

- Pair question and solution files by the complete source identifier, including suffixes such as `00a`, `01b`, or `hw08`.
- Record unmatched questions and unmatched solutions before rendering. Never silently shift a solution to the neighboring worksheet.
- Extract every large problem, subpart, assumption, numerical constant, code block, graph coordinate, matrix entry, table heading, and allowed formula.
- Read the PDF page when extracted text loses a diagram, table, handwritten annotation, or mathematical symbol.
- Use local question files for the statement and local official solution files for the answer. Do not reconstruct an “official” answer from lecture notes.

## Claude Code batching

- Use `scripts/run_claude_extraction.py` with an explicitly selected, machine-verified model and the bundled `work-item-extraction.schema.json`. Do not require a particular model family from every user.
- Batch one long homework with its solution, or at most four short discussion/solution pairs.
- Embed inventory-extracted text and use `--no-tools` for the main extraction. Run a separate, small `Read`-enabled pass only for visually incomplete PDF pages. Split a batch that reaches the configured timeout without producing an artifact.
- For a single long handout that still times out, shard by problem number and merge only disjoint, schema-valid results with `scripts/merge_extraction_shards.py`. Never concatenate model prose or resolve conflicting shard identities automatically.
- Keep all results and run metadata under `.course-build/claude-extraction/`; never pass the full extraction through the primary context merely to save it.

## Page structure

Render in this order:

1. Existing human-written guide or a concise source-grounded introduction.
2. Complete localized statement marked `官方题面翻译` and `可离线作答`.
3. Collapsed hint containing only an entry point, invariant, formula choice, or sanity check.
4. Collapsed official solution clearly labeled `官方参考解答`.
5. Question and solution provenance with local filename, page, and extraction confidence.

If no local official solution exists, show that status and omit the solution disclosure. Do not manufacture an answer merely for visual consistency.

## Implementation handouts without solutions

- Use `kind: Assignment` or `kind: Lab` for long programming handouts. The shared schema and renderer support both without requiring an answer key.
- Preserve every stable problem identifier, interface, tensor shape, formula, permitted dependency, command, deliverable, point value, runtime target, and acceptance test needed to implement the assignment without reopening the PDF.
- Translate the handout's explanatory context as well as its task sentences. A list of deliverables alone is not a self-contained handout.
- Keep `solutionStatus: no-local-solution` and `solutionMarkdown` empty unless a publishable official solution is actually present and authorized. Non-answer hints may clarify prerequisites, debugging order, and validation strategy, but must not provide submit-ready code.
- Render these pages as `完整 Handout：任务、约束与验收`; retain the existing assignment guide above the generated task outline.

## Algorithm-course interactives

Create only source-backed interactives that reduce reasoning load:

- `stepper`: Euclid, extended Euclid, graph traversal, greedy exchange, dynamic-programming recurrence, max-flow augmentation, proof or reduction stages.
- `matrix-heatmap`: DP tables, adjacency/transition matrices, residual capacities, probability tables.
- `function-plot`: probability bounds, expectation/tail behavior, runtime or approximation tradeoffs with meaningful parameters.
- Static SVG: graph instances, recursion trees, state diagrams, cut/flow structure, geometry that does not benefit from controls.

Keep the question answerable without interaction. An interactive supplements the complete statement; it never hides required values or replaces a proof.

## Validation

- Verify question/solution pair counts and identifiers.
- Check at least the first, middle, last, image-heavy, and longest work item against rendered PDF pages.
- Search for missing subparts, “see PDF/figure/textbook,” unsupported dollar math, external dependencies, and answer leakage in hints.
- Exercise one hint, one solution disclosure, every interactive kind, desktop Discussion drawer, and a narrow viewport.
