# Historical Implementation Recap profile

Use this profile only when the course has a learner-owned prior implementation. Its purpose is to reconstruct protocol or model understanding from code-backed evidence—not to republish a current solution and not to narrate a file function by function.

## Source and attribution gate

Before drafting, inspect the repository working tree, root or starter commit, later diffs, TODO or stage markers, handout/spec, tests, fixtures, and relevant commit messages. Build an attribution ledger:

```text
symbol / range | starter or framework | learner addition or modification | evidence
```

Only a line or minimal snippet supported by a diff may be labeled `YOUR CODE · Historical Implementation`. Label inherited types, callbacks, supplied validation logic, and reference implementations `Framework Context`. If the boundary is unclear, use neutral wording such as “the historical repository contains”; never infer authorship from file ownership alone.

Keep a prominent version boundary:

```text
current official spec ≠ historical implementation
```

Do not turn a similar historical interface into a copyable answer for a live assignment. Prefer state, invariants, traces, failure analysis, and small non-contiguous excerpts.

## Required construction path

Organize by the lifecycle of the system, not source-file order:

```text
Repository Audit
→ Skeleton vs User Code Attribution
→ State/Object Map
→ Critical Execution Paths
→ Invariant Extraction
→ Full Execution Trace
→ Failure / Counterfactual
→ Code Prediction Questions
→ Closed-book Reconstruction
```

For every excerpt answer:

1. What does it do?
2. Why must the protocol or model do this?
3. What breaks if the logic is wrong or removed?

Expose the state before the event, the exact transition, the output, and the state after it. A queue is not “a list”; say what claim each retained element represents and what evidence permits removal. A condition is not “an edge case”; name the invariant it protects.

## Gold evidence

A Gold recap contains all of the following, with topic-specific content rather than template filler:

- an attribution map with direct commit/diff evidence;
- a state/object map;
- explicit Code → Concept mappings;
- at least one complete state/table/packet/tensor execution trace;
- a counterfactual that deletes or reverses a real condition and derives the failure;
- code-prediction questions whose distractors correspond to plausible bugs;
- a Bug Reconstruction only when a commit, failing test, or documented failure supports it;
- a compact `Then / Now` reflection connecting test-passing behavior to the invariant;
- contextual links back to prerequisite Lessons;
- a closed-book reconstruction task.

Never invent a historical bug. If evidence is absent, use a labeled “Contract risk” and propose the test that would expose it.

## Reading flow and status

Keep provenance compact, then begin with the system’s central question. Place code only after the state and problem have been established. Use the smallest excerpt that reveals one mechanism; link to the historical repository for context. Do not put a source dump, commit diary, or large legacy disclosure in the main reading flow.

Track two independent facts when necessary:

- `recap depth`: `GOLD / GOOD / SHALLOW`;
- `current source compatibility`: verified or `BLOCKED_BY_SOURCE`.

Thus a deep historical transport recap can be `recap depth = GOLD` while the current-term Project remains `BLOCKED_BY_SOURCE`. Never promote source compatibility because the old code is detailed.

## Human-quality review

The learner should be able to close the page and reconstruct the saved state, event-to-transition path, invariant protected by one branch or queue operation, failure caused by removing it, and which portions were theirs versus framework context. If not, the recap is `SHALLOW`, even when every required CSS marker exists.
