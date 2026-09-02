# Lesson learning-system contract

Use this contract when creating or substantially refactoring CourseStack Lesson pages. The Lesson is an interactive textbook, not a lecture transcript, slide summary, glossary, or quiz feed.

## Teaching outcome

A learner should be able to reconstruct the mechanism without the page, explain why it is needed, derive it from a small example, state where the result stops applying, diagnose a plausible wrong approach, and transfer the idea to a new case.

Depth is not word count. Prefer closing a reasoning gap over adding another topic.

## Audit before writing

For an existing course, first apply the version audit in [source-discovery-and-migration.md](source-discovery-and-migration.md), then inspect both rendered page and source before expanding it. Do not assume that a new title, diagram, or longer page means the underlying course has been migrated. For each major concept, locate:

- a prerequisite the page silently assumes;
- a formula or conclusion whose intermediate reasoning is omitted;
- two objects that a beginner may conflate;
- a tempting alternative design and a counterexample showing where it differs;
- a claim whose status is unclear: exact identity, asymptotic result, napkin-math approximation, or implementation/hardware-specific observation;
- an exercise gap where the prose is deeper than the learner's opportunity to verify understanding.

Search Git history before replacing a human-written explanation or exercise bank. Preserve useful content and reorganize it rather than regenerating it.

Audit every official Lesson, not only representative pages. Keep a page-level depth ledger so a course-wide request cannot accidentally become a diagram-only or first-few-lessons pass.

## Core concept arc

Use this sequence when it matches the concept; do not turn every line into a card:

```text
problem and why it exists
→ minimal intuition
→ named objects and their relationships
→ toy example
→ step-by-step mechanism or derivation
→ general formula / rule
→ real system or production setting
→ misconception and counterexample
→ local Concept Check
→ one-sentence mental model
```

Do not jump directly from a definition to a large-model example. Use `toy example → general rule → Transformer/system → real hardware` where scale matters.

When the page says “therefore,” “usually,” “for efficiency,” “memory-bound,” or gives a ratio such as backward ≈ 2× forward, verify that a first-time learner can reproduce the missing chain. If not, add the smallest derivation that closes it.

## Prerequisite recovery

At the start, use a lightweight `Before We Start` or prerequisite refresher. It should reactivate only the knowledge needed for this lesson. If a prerequisite has not been established earlier, include a short but complete refresher rather than assuming the learner will fill it in.

Examples of hidden dependencies:

- KV cache depends on causal attention, Q/K/V, and autoregressive decoding.
- resource estimates depend on matrix multiplication FLOPs, forward/backward, shapes, and units.
- MFU depends on FLOP, FLOP/s, and theoretical peak throughput.

## Claim discipline

Make the epistemic status visible near important conclusions:

- **Exact** — shape identities, definitions, conservation relationships.
- **Asymptotic** — growth rates such as \(O(n^2)\).
- **Approximation** — models such as training FLOPs \(\approx 6PD\).
- **Implementation / hardware specific** — measured throughput, capacity, latency, or a framework behavior tied to a version.

Never turn an approximation or benchmark into a universal law. Bind hardware numbers to source, precision, sparsity convention, shape, software, and date when those conditions matter.

## Practice rhythm

Use two layers:

1. Inline Concept Checks immediately after a core mechanism. They test causal reasoning, object distinction, derivation, counterexamples, or transfer—not vocabulary recall.
2. A lesson-end Deep Quiz for cross-section integration. It remains optional and is labeled as comprehensive understanding validation.

Also include a small closed-book `Explain It Yourself` section. Reference answers stay collapsed.

For a multiple-choice item, every distractor should correspond to a plausible misconception. Feedback explains why the correct choice works and why each alternative fails. If the learner is wrong, name the confused mental models.

When a follow-up variant exists:

- wrong answer → automatically show diagnosis, short mechanism recovery, then the follow-up;
- correct answer → show only an optional `再验证一次` disclosure.

Keep practice data separate from the renderer when many lessons share the same behavior. Do not duplicate interaction logic in page HTML.

## Reading experience

Use ordinary editorial prose for the main path. Reserve special visual treatment for a small vocabulary such as Mental Model, Derivation, Misconception, Concept Check, and Deep Dive.

- Avoid a card around every paragraph.
- Keep one active current-term narrative. Merge still-valid older explanations naturally; move retired requirements out of the active flow.
- Let the opening answer the core question quickly. Do not place five independent teaching cards before the first real section.
- Put worked examples after the minimum mechanism required to interpret them unless the example intentionally poses the problem.
- Collapse paper-specific detail, framework variants, historical notes, and benchmarks that are not required for the main reasoning chain.
- Keep the lesson TOC useful but do not create a three-column reading layout or two competing TOCs.
- Make shapes, equations, code, and comparison tables locally scrollable on mobile; never allow page-level horizontal overflow.
- Keep sticky navigation offsets compatible with direct anchors and `prefers-reduced-motion`.

Use [reading-flow.md](reading-flow.md) for the final course-wide pass. That pass should normally reduce duplication and visual weight rather than add words.

## Framework diagrams

Use semantic HTML/CSS or static SVG when architecture, topology, ownership, hierarchy, object relationships, tensor flow, or state transitions are materially easier to understand spatially. Prefer repository-native diagrams with responsive layout and accessible labels. Large ASCII framework drawings are not a substitute for a real diagram; retain ASCII only for compact inline pipelines or terminal-like examples.

Every diagram needs nearby prose explaining what to notice. Do not add decorative visuals or claim a redrawn teaching diagram is an official figure.

## Course continuity

Recover relevant prior knowledge at the start and connect to the next lesson at the end. Explain where the current idea will reappear. Add a concrete `Learn → Build → Return` bridge to an Assignment stage when the learner will implement the mechanism.

## Audits and regression

Before claiming a lesson complete:

1. Run a misconception audit: identify likely wrong mental models and ensure each is handled in prose, a counterexample, or practice.
2. Run a question audit: list the ten most likely learner questions. If they concern the core mechanism, formula origin, concept distinction, key “why,” or a basic example, improve the page. Leave framework edge cases, research extensions, and personalized diagnosis to an adaptive tutor.
3. Add content lint for critical technical phrases or units when a regression would be easy to reintroduce. Prefer semantic assertions over fragile full-sentence matching.
4. Keep audit reports honest: “fixed” means the content source or rendered behavior can be detected and verified.
5. Inspect the runtime DOM for duplicate TOCs, hidden ledes, misplaced examples, nested disclosures, or renderers that reinsert archived content.
6. Compare desktop and mobile screenshots in equivalent states. Test inline answer feedback, wrong/correct follow-up behavior, direct anchors, Deep Quiz disclosures, and keyboard focus. If screenshots or browser QA are unavailable, report that limitation instead of claiming visual verification.

Do not claim the course is textbook-grade merely because every lesson contains the same headings. The mechanism, examples, misconceptions, and practice must be specific to the lesson's reasoning task.
