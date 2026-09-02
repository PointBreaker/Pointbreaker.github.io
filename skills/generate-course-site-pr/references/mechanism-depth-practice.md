# Mechanism depth and practice gates

Use this reference while planning and reviewing every core concept. These are reasoning gates, not mandatory visible headings.

## Mechanism Gate

Before writing a major section, answer all ten questions in the depth ledger:

1. Why does this problem exist?
2. What is the simplest plausible solution?
3. Why is that simple solution insufficient?
4. What objects does the real mechanism operate on?
5. What state does the system preserve?
6. What input event starts the transition?
7. What changes internally, in order?
8. What output is emitted or made visible?
9. What invariant must remain true?
10. What breaks if the mechanism is removed, reversed, or deprived of its state?

If a source-grounded answer is missing, mark the concept `DO_NOT_WRITE_YET`, return to source discovery, and record the gap. Do not hide uncertainty behind fluent prose.

## Worked Trace Gate

Every core Systems, Networking, Distributed Systems, or ML lesson needs at least one complete worked trace:

```text
initial objects and state
→ event / operation 1
→ exact mutation and output
→ event / operation 2
→ exact mutation and output
→ final state and invariant check
```

A trace is not a one-line example followed by a conclusion. Use concrete values small enough to verify by hand. Show the state that does not change as well as the state that changes. For asynchronous mechanisms, make time or event order explicit.

For Algorithms and Theory, use the analogous iteration, derivation, or proof-state trace.

## Counterfactual Gate

Each major lesson needs one or two source-compatible counterfactuals. Prefer choices that reveal design necessity:

- remove the mechanism;
- reverse a comparison or update direction;
- omit required state;
- reorder, duplicate, delay, or lose an input;
- fail a link/device or violate a shape/typing precondition;
- substitute the tempting minimal design from the Mechanism Gate.

State the first invariant that fails, the resulting state, and the observable symptom. “It would not work” is insufficient.

## Misconception Gate

A misconception treatment contains three parts:

1. **Why it is tempting** — the local observation or analogy that creates the wrong model.
2. **Concrete counterexample** — a minimal packet, state, tensor, input, or proof case where it predicts the wrong result.
3. **Replacement model** — a compact rule the learner can apply next time.

Do not accept “注意不要混淆 A 和 B” by itself.

## Practice rhythm

Select practice according to conceptual load; do not mechanically hit a quota. A core lesson with only one multiple-choice item is `INSUFFICIENT` unless the lesson is itself a short index or orientation.

Useful rhythm:

- **Before We Start:** two or three retrieval or prediction prompts for required prerequisites;
- **Inline Concept Checks:** three to six decisions placed immediately after the mechanism they test;
- **End-of-Lesson Deep Checks:** three to five cross-section problems;
- **Explain It Yourself:** one to three closed-book prompts, with reference criteria collapsed rather than exposed as an answer key.

Checks may be interactive quizzes, trace tables, short predictions, error diagnosis, or construction tasks. Not every check should be multiple choice.

## Question Quality Gate

Prefer questions about direction, state, causality, invariant, shape, sequence, failure, counterfactual, and transfer. Use vocabulary recall only when the term itself is a prerequisite for later reasoning.

Every distractor maps to a plausible wrong mental model. Feedback should name that model, show why it fails on the current case, and point to the state or invariant that resolves it.

## Depth decision

Before marking a lesson complete, test whether a learner can, closed-book:

- explain why the mechanism exists;
- hand-trace one nontrivial example;
- predict one failure or counterfactual;
- identify the state the system stores;
- explain which invariant an implementation condition protects.

If any core outcome is unsupported by prose, trace, or practice, mark the lesson `SHALLOW`. Page existence, word count, section count, attractive layout, and source coverage do not override this result.

