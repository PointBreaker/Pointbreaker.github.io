# Discussion / Worksheet Reconstruction Profile

Use this profile when a course publishes discussion sheets, recitations, tutorials, or worksheets. Product boundaries are strict:

```text
Lesson = Conceptual Textbook
Discussion = Guided Reasoning Workbook
Project = Engineering / Implementation Workbook
```

A Discussion must let a learner complete a coherent derivation, trace, diagnosis, and transfer exercise without opening the source PDF. The worksheet and official solution remain sources of truth and original references, not the page body.

## Source audit and rights boundary

Read the worksheet and its official solution before authoring. The solution is required authoring evidence: use it to verify intermediate reasoning, intended misconceptions, edge cases, and answer conventions. Do not reproduce long prompts, diagrams, or solution prose. Preserve official problem IDs and short titles, then create clean-room CourseStack scenarios, numbers, diagrams, explanations, and variations.

For every substantive subproblem record:

```text
Problem ID | given | derive | required concepts | required state
key invariant | misconception | reasoning steps | expected evidence
```

Topic-name coverage is not subproblem coverage. Multiple repetitive subproblems may map to one reconstructed activity only when that activity explicitly exercises every distinct reasoning step. Record the mapping in a coverage artifact.

## Guided problem loop

Every core activity should follow a readable vertical loop:

```text
Why the official problem exists
→ Problem Setup
→ Prediction
→ Work It Out
→ Hint 1: Concept
→ Hint 2: State / Invariant
→ Hint 3: First Step
→ Reveal / Explanation
→ Why This Works
→ Common Wrong Turn
→ Variation
```

The setup must contain all topology, values, state, timing, and event-order assumptions needed to work. Use semantic HTML/CSS or an accessible SVG for spatial relationships. The learner work should require a table, timeline, packet fields, state transitions, derivation, or counterexample—not silent reading.

Reveal is tutoring, not an answer key. State what is known at that moment, the rule applied, why the event permits an update, which state changes, why another state cannot yet change, and what evidence would distinguish a wrong model. Keep hints collapsed; keep the main problem and work surface visible.

## Status and gates

- `OUTLINE_ONLY`: titles, workflow, hints, or PDF links without self-contained reasoning activities.
- `PARTIAL`: real worked activities exist but substantive reasoning coverage is incomplete.
- `DIGESTED`: every substantive worksheet skill is mapped and reconstructed with guided work and explanation.
- `GOLD`: `DIGESTED` plus diagnostic variations, misconception analysis, an interactive or fillable trace where useful, and closed-book reconstruction.

### Anti-Outline Gate

Reject a page when it contains only official titles plus generic workflow/hints/source links. Error: `This is an index, not a digested workbook.` Presence of a problem ID or a reveal label alone is not evidence; require concrete givens, learner state work, and a reasoned reveal.

### Coverage Gate

Compare the exact set of substantive official IDs against the union of `data-official-ids` on reconstructed activities. Missing IDs make the page at most `PARTIAL`; an unmapped majority is `OUTLINE_ONLY`. Do not mark every row `FULL` mechanically: inspect whether the mapped activity preserves the original reasoning dependency.

Gold additionally requires a variation that changes a causal variable rather than only renaming nodes, misconception diagnosis with a concrete wrong trace, and a new closed-book scenario. Structural markers are regression evidence, not proof of teaching quality.

## Course continuity and reading flow

Start with a compact source line and the first problem, not a card dashboard. Use prose, diagram, table, input/work surface, collapsed hints, reveal, and variation in one vertical flow. Each Discussion links to the exact Lesson mechanism a learner may recover; each relevant Lesson links back to the matching Discussion activity.

Run `scripts/audit_discussion_coverage.py` after authoring, then manually answer: if both official PDFs disappear, can a learner still perform the reasoning, see a fully explained derivation, diagnose a mistake, and transfer to a new case? If not, downgrade and revise.
