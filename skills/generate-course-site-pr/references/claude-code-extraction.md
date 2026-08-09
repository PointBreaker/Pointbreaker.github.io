# Claude Code extraction delegation

Use Claude Code only as a bounded extraction worker for large local resource sets. The primary agent owns source reconciliation, curriculum modeling, factual decisions, writing standards, frontend design, validation, and the final PR.

## Model selection and mandatory preflight

Before every extraction run:

1. Confirm `claude` exists and `claude --help` exposes `--model` and JSON output.
2. Invoke the worker with an explicit model label available in the current Claude Code installation; do not rely on a default model, resumed session, or silent fallback. Honor a user-requested model when it is available. Otherwise choose a capable installed model appropriate to the batch size, or continue in the primary agent if Claude Code is unavailable.
3. Use a tiny JSON probe first and inspect its machine-readable metadata or debug trace. When the expected canonical model, provider, or context window is known, pass those expectations to the runner and reject substitutions. Machine metadata, not the display label or model self-report, is authoritative.
4. If the CLI rejects the identifier, silently substitutes another model, omits verifiable model metadata, or cannot authenticate, do not run Claude Code. Continue locally or report the extraction limitation.

Never claim that the model was verified from self-reported prose. Verification must come from the CLI invocation and its metadata.

## Worker boundary

Delegate tasks such as:

- extracting headings, dates, titles, formulas, captions, and resource identifiers from many local files;
- producing a source-indexed candidate schedule;
- locating repeated or conflicting passages across downloaded handouts;
- returning structured candidate mappings between lecture, homework, lab, and exam resources.
- translating large batches of extracted work items into consistent Simplified Chinese;
- proposing source-labeled, self-contained onsite equivalent exercises when an official handout contains only a textbook reference.

Do not delegate:

- deciding which conflicting source is canonical;
- inventing missing course facts or pedagogical content;
- defining `dependsOn`, stage boundaries, or information architecture without primary-agent review;
- editing the website, running git commands, opening a PR, or browsing the web;
- final math, citation, link, accessibility, or browser QA.
- accepting a reconstructed or equivalent exercise as publishable without primary-agent source review.

## Invocation contract

Use a fresh non-persistent print session with explicit model selection, a narrow tool allowlist, and a JSON schema. Do not resume an earlier conversation. Give Claude Code read access only to the named local source folder and write no repository files directly.

Prefer the bundled verified capture runner so large structured results go directly to runtime artifacts without entering the primary agent's context:

```bash
python <skill-root>/scripts/run_claude_extraction.py \
  --prompt-file <build-dir>/claude-extraction/prompt.md \
  --schema-file <build-dir>/claude-extraction/schema.json \
  --output <build-dir>/claude-extraction/result.json \
  --run-json <build-dir>/claude-extraction/run.json \
  --workdir <source-folder> \
  --add-dir <source-folder> \
  --add-dir <inventory-output> \
  --model '<available-model-label>'
```

The runner performs a fresh machine-verified preflight for every extraction, exposes at most the `Read` tool, records usage, and writes only under `.course-build/`. Pass `--expected-canonical-model`, `--expected-provider`, and `--expected-context-window` when the environment exposes stable values and model substitution must be rejected.

When the prompt already embeds all required extracted text, disable tools for the main pass so the worker cannot waste time reopening the source set:

```bash
python <skill-root>/scripts/run_claude_extraction.py ... \
  --model '<available-model-label>' \
  --no-tools
```

Use a second, small `Read`-enabled run only for pages flagged as diagram-heavy, OCR-incomplete, or low confidence. `run_longcat_extraction.py` remains a backward-compatible alias; new workflows should use the generic runner.

If a complete handout still reaches the timeout, split it by stable source boundaries such as problem numbers or sections. Require every shard to return the same document identity, disjoint problem IDs, and complete local evidence, then merge the schema-valid shards without asking a model to rewrite them:

```bash
python <skill-root>/scripts/merge_extraction_shards.py \
  --data <build-dir>/claude-extraction/shard-01.json \
  --data <build-dir>/claude-extraction/shard-02.json \
  --output <build-dir>/claude-extraction/result.json
```

Apply the same output-risk control to long lecture or handout-to-lesson generation. If the requested response is likely to exceed roughly 12,000 output tokens, or the first attempt stalls or closes mid-response, split the source at stable section boundaries before retrying. Each shard must use `thematic-lesson-extraction.schema.json`, repeat identical module identity fields, and return disjoint section and quiz IDs. Keep the combined schema budgets at 3–8 sections, 2–4 quizzes, 2–5 misconceptions, and 3–7 recap items. Merge the valid shards locally without another model rewrite:

```bash
python <skill-root>/scripts/merge_lesson_shards.py \
  --data <build-dir>/claude-extraction/lesson-part-01.json \
  --data <build-dir>/claude-extraction/lesson-part-02.json \
  --output <build-dir>/claude-extraction/lesson.json
```

Do not retry the same oversized prompt repeatedly. A zero-token idle timeout may be retried once; a partial response with substantial output should be reshaped into smaller shards so already-observed output risk is not repeated. This policy applies to any selected Claude Code model and does not assume a particular provider or context-window size.

Before rendering model-produced lesson or work-item JSON, normalize any schema-valid dollar-delimited math and reject unmatched delimiters:

```bash
python <skill-root>/scripts/normalize_extraction_math.py \
  --input <build-dir>/claude-extraction/result.json \
  --output <build-dir>/claude-extraction/result-normalized.json
```

Render only the normalized artifact. This deterministic step is a safety net for workers that ignore the requested `\(...\)` / `\[...\]` convention; it does not repair malformed LaTeX or replace final math QA.

For solution-bearing discussion or homework batches, normalize the worker output to the evidence-backed work-item schema used by the build, review low-confidence records and visual requirements, then render it with:

```bash
python <skill-root>/scripts/render_extracted_work_items.py \
  --repo <course-site-repo> \
  --slug <course-slug> \
  --data <build-dir>/claude-extraction/result.json
```

The renderer preserves an existing guide, inserts or replaces only the complete source-outline region, keeps official solutions collapsed, creates discussion pages when needed, and updates `course-info.json` with source, problem-count, and solution-availability metadata. Do not render until the primary agent has reviewed source mappings, conflicts, and figure reconstruction requirements.

Require each extracted fact to include:

- `value`;
- `sourceFile` relative to the resource folder;
- `pageOrSlide` when available;
- `evidence` as a short verbatim excerpt;
- `confidence` as `high`, `medium`, or `low`;
- `conflictGroup` when sources disagree.

Store captured output under `.course-build/claude-extraction/`. Validate the JSON, spot-check representative source pages, resolve conflicts using `content-quality.md`, and only then transform candidates into `course-plan.json`.

## Safety and cost control

- Never pass secrets, browser sessions, repository credentials, or unrelated user files.
- Never grant Bash, Edit, Write, network, or git tools for extraction.
- Batch related files, request concise structured output, and set an explicit budget when supported.
- Keep PDF-visual batches small: normally one long homework plus its solution, or at most four short discussion sheets. Embed inventory-extracted text and use zero tools for the main pass. Open only pages whose tables, diagrams, or OCR are incomplete in a later targeted `Read` run. Use the verified runner's timeout rather than allowing an unproductive whole-course vision pass to run indefinitely.
- Stop after one corrective retry if the output violates the schema or lacks evidence; perform the remaining work locally.
- Record the verified model, invocation time, input file list, and output path in `.course-build/claude-extraction/run.json` for reproducibility. Do not commit runtime extraction artifacts.
