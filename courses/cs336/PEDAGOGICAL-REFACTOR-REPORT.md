# CS336 Spring 2026 Pedagogical Refactor Report

## Scope

This pass restructures the existing Stanford CS336 Spring 2026 Chinese guide for lower first-read cognitive load. It does not regenerate the course, expand the topic inventory, or blur the boundary between Spring 2026 official material and labeled supplements.

**Technical content removed: NONE.**

Formulas, cost models, system mechanisms, hardware details, implementation notes, references, and legacy assignment material remain available. The primary change is their order and default visibility.

## Course-wide changes

- Added one lightweight 30-second learning map to each of the 19 lecture pages.
- Added 31 page-specific bridge sentences that make the causal transition between sections explicit.
- Added 43 `<details>` disclosures for derivations, implementation detail, hardware tables, configuration walkthroughs, and reference material.
- Converted 102 pure-comment pseudo-code blocks into normal `.prose-outline` content.
- Reduced lecture `<pre>` blocks from 275 to 158 while leaving real code, pseudocode, ASCII structure, and useful accounting walkthroughs intact.
- Added shared styles for `.bridge`, `.learning-map`, `.concept-figure`, `.deep-dive`, `.takeaways`, and `.prose-outline`.
- Added valid answer keys to previously non-functional lecture quizzes and corrected the L11 extrapolation question: 1B to 1T is a 1000× extrapolation.
- Loaded the existing Prism resources on all five assignment pages so Python and shell examples retain indentation and receive syntax highlighting.
- Reworked all five assignment pages into a learning cockpit: mission and deliverables, dependency-first task route, recursive prerequisite tree, compact pre-coding cheatsheet, then the preserved detailed guide and full task outline.
- Moved the original component tables, prerequisite lists, implementation sequences, pitfalls, testing notes, and course mappings into closed reference disclosures so they remain available without dominating first read.
- Changed complete task indexes into compact two-column desktop cards and single-column mobile cards; opened tasks span the full desktop content width.
- Added source-labeled conceptual SVGs for Assignment 1's Transformer/training stack and Assignment 4's auditable web-data pipeline.
- Added a reusable translated-handout formatter shared by all five assignments. It preserves the extracted wording while turning previously unwrapped labels into headings, grouping background and subproblems into readable cards, highlighting deliverables/resources/checks, and wrapping handout tables in local horizontal scrollers.

## Gold sample: Lecture 7

Lecture 7 now follows this learning path:

1. Why a single GPU is insufficient.
2. Why more GPUs introduce communication.
3. What ranks and collectives mean.
4. All-Reduce intuition before the ring cost model.
5. Why logical bytes must be mapped to physical topology.
6. Scale-up and scale-out network paths.
7. How topology changes DP, FSDP, TP, PP, SP, and EP placement decisions.

The topology diagram now separates the two conceptual branches:

- GPU/HBM → NVLink/NVSwitch → peer GPUs for scale-up.
- GPU/HBM → PCIe → HCA/NIC → IB/RoCE for scale-out.

The diagram is explicitly labeled as a conceptual model rather than a universal wiring diagram. Ring derivation, the full collective table, hardware references, Megatron details, pipeline schedules, and configuration accounting remain available under progressive disclosure.

## Priority AI-infrastructure path

| Page | Main structural change | Default-visible text ratio |
| --- | --- | ---: |
| L2 Resource accounting | Resource-accounting spine; PyTorch implementation details folded; decode bottleneck wording corrected | 59.1% |
| L5 GPUs/TPUs | Architecture → roofline → programming consequences; specification and programming detail folded | 67.2% |
| L6 Kernels/Triton | Benchmark → bottleneck → fusion → tiling → Triton; CUDA/PTX/hardware detail folded | 68.5% |
| L7 Parallelism | Communication primitives → cost model → topology → strategy placement | 64.7% |
| L8 ZeRO/FSDP | DDP redundancy → ZeRO stages → FSDP lifecycle; detailed accounting and multidimensional configurations folded | 37.9% |
| L10 Inference | Prefill, decode MLP, and decode attention separated; serving mechanisms organized by the bottleneck they address | 70.3% |
| Assignment 2 | Spring 2026 authoritative map remains visible; the complete Spring 2025 legacy supplement is preserved under one outer disclosure | n/a |

The ratio is a first-pass density estimate: text outside `<details>` divided by all page text. It is not a readability score.

## Assignment learning cockpit

The five assignment pages now use the same dependency-first reading model while preserving their different source boundaries:

| Assignment | Default-visible route | Recursive knowledge roots | Source boundary |
| --- | --- | --- | --- |
| A1 Basics | text → token IDs → logits → parameter update → training system | representation, model, optimization, training system | Spring 2025 complete handout remains visible after the folded original guide |
| A2 Systems | benchmark/profile → checkpointing → FlashAttention-2 → DDP overlap → state sharding | measurement, kernel, communication, state sharding | Spring 2026 authoritative map remains visible; both the old generic guide and Spring 2025 detailed supplement default closed |
| A3 Scaling | small experiments → IsoFLOPs → fit → extrapolate → stress-test | experimental design, compute accounting, statistical model, extrapolation | Spring 2025 complete handout remains visible after the folded original guide |
| A4 Data | WARC → extraction → safety/privacy → quality → dedup → tokenize → validate | raw web, safety/privacy, quality, deduplication | Spring 2025 complete handout remains visible after the folded original guide |
| A5 Alignment | prompting → rollout primitives → standard GRPO → on-policy variants → off-policy/GSPO → safety/preferences | evaluation, sequence probability, reward/advantage, policy update | Spring 2026 authoritative map remains visible; both the old generic guide and Spring 2025 detailed supplement default closed |

The cheatsheets intentionally stop at formulas, tensor/data invariants, experiment contracts, and debugging order. They do not contain submit-ready implementations or solution keys.

### Complete handout presentation

The complete translated handouts remain first-class content rather than archival text dumps. When a task is opened, the page now presents:

1. source/offline/solution-boundary badges;
2. a compact reading order for statement, optional hint, and verification/source layers;
3. separately framed background, setup, constraints, and subproblem blocks;
4. visually distinct deliverable, resource, note, and self-check callouts;
5. preserved code blocks, lists, math, and horizontally scrollable source tables;
6. collapsed non-answer hints followed by implementation boundaries and source provenance.

The formatter operates on the existing generated outline DOM, so future source-outline refreshes can retain the same presentation without manually rewriting every translated problem.

## Technical and source-boundary corrections

- Replaced the absolute `Prefill = compute-bound / Decode = memory-bound` model with shape- and workload-dependent language.
- Distinguished decode MLP weight reuse from decode attention KV-cache traffic; batching can improve MLP arithmetic intensity, while long-context decode attention remains especially bandwidth-sensitive.
- Removed claims that inference speedup follows weight compression ratios directly; actual gains depend on kernels, metadata, batch, hardware support, and the active bottleneck.
- Qualified the DeepSeek-R1-Zero “aha moment” claim: the paper reports behaviors strengthened during RL without cold-start SFT examples, but this does not prove the base model never saw similar text patterns during pretraining.
- Replaced “fully covers Lecture X” footer claims with “based on Spring 2026 Lecture X official material.”
- Corrected Assignment 2 prerequisites and connection mapping to Lectures 5–8; Lecture 9 is not presented as the sharding source.
- Preserved the Spring 2025 Assignment 2 content as a clearly labeled legacy supplement, with Spring 2026 handout/repository requirements authoritative on conflicts.

## Validation

- `refresh_status.py`: 19/19 lectures complete.
- `validate_course.py`: pass, 25 HTML pages, 19 lectures, 5 work items.
- `validate_interactive.py`: pass.
- `validate_assignment_localization.py`: pass.
- `tools/check-course-layout.py`: pass across the site.
- `tools/check-table-columns.py`: pass.
- `tools/check-code-block-formatting.mjs courses/cs336`: pass.
- `git diff --check`: pass.

## Browser QA

Checked the Dashboard, L2, L5, L6, L7, L8, L10, L14, L17, and all five assignments at desktop width. Rechecked all five assignments at 390 px; captured representative full-page mobile screenshots for A1, A4, and A5.

- No page-level horizontal overflow.
- No KaTeX render errors.
- Every tested lecture has one learning map; deep-dive disclosures default closed.
- Visible tables retain intrinsic width and become horizontal scrollers on mobile.
- Code blocks keep internal horizontal scrolling without widening the page.
- Assignment code blocks load Prism tokens.
- L7 topology SVG loads successfully.
- L10 quiz answer feedback reaches the `correct` state with the revised decode-attention explanation.
- Assignment 2 Spring 2026 problem map is visible; Spring 2025 legacy content defaults closed.
- Assignment 5 Spring 2026 problem map is visible; Spring 2025 legacy content defaults closed.
- Every assignment cockpit defaults to the compact route/tree/cheatsheet view; all five original detailed guides default closed.
- A1 and A4 conceptual SVGs load successfully; their captions explicitly identify them as task-relationship redraws rather than Stanford official figures.
- Assignment task indexes use two columns on desktop and one column at 390 px without title/problem-id collisions.
- Opened translated tasks were checked across A1 and A2 at desktop width, including multi-part questions, code, and source tables. The formatter preserved page width and produced no math errors.
- A representative multi-part A1 task was checked at 390 px: the reading strip, background, subproblem cards, and deliverables stack into one column without horizontal overflow.
- Opening the Discussion drawer reserves desktop reading width instead of covering the lesson.

The only console messages observed after opening Discussion were expected giscus 404/warnings stating that the page-specific GitHub Discussion does not yet exist and will be created on first submission.

## Commit boundary

The intended PR contains only `courses/cs336/**`. Browser screenshots, `.playwright-cli/`, and other disposable output are excluded.
