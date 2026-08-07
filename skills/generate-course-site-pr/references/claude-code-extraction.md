# Claude Code extraction delegation

Use Claude Code only as a bounded extraction worker for large local resource sets. The primary agent owns source reconciliation, curriculum modeling, factual decisions, writing standards, frontend design, validation, and the final PR.

## Mandatory model preflight

Before every extraction run:

1. Confirm `claude` exists and `claude --help` exposes `--model` and JSON output.
2. Invoke the worker with the exact flag `--model longcat-2.0`; do not rely on a default model, alias, resumed session, or fallback model.
3. Use a tiny JSON probe first and inspect its machine-readable metadata or debug trace for the actual resolved model identifier. Continue only when it is exactly `longcat-2.0`.
4. If the CLI rejects the identifier, silently substitutes another model, omits verifiable model metadata, or cannot authenticate, do not run Claude Code. Continue locally or report the extraction limitation.

Never claim that the model was verified from self-reported prose. Verification must come from the CLI invocation and its metadata.

## Worker boundary

Delegate tasks such as:

- extracting headings, dates, titles, formulas, captions, and resource identifiers from many local files;
- producing a source-indexed candidate schedule;
- locating repeated or conflicting passages across downloaded handouts;
- returning structured candidate mappings between lecture, homework, lab, and exam resources.

Do not delegate:

- deciding which conflicting source is canonical;
- inventing missing course facts or pedagogical content;
- defining `dependsOn`, stage boundaries, or information architecture without primary-agent review;
- editing the website, running git commands, opening a PR, browsing the web, or accessing Google Drive/Docs;
- final math, citation, link, accessibility, or browser QA.

## Invocation contract

Use a fresh non-persistent print session with explicit model selection, a narrow tool allowlist, and a JSON schema. Do not resume an earlier conversation. Give Claude Code read access only to the named local source folder and write no repository files directly.

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
- Stop after one corrective retry if the output violates the schema or lacks evidence; perform the remaining work locally.
- Record the verified model, invocation time, input file list, and output path in `.course-build/claude-extraction/run.json` for reproducibility. Do not commit runtime extraction artifacts.
