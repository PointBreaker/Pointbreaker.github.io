# Gold Standard workflow and course-wide depth QA

Use this reference for every new course and every substantial teaching-depth refactor.

## Select Gold lessons

After the source audit, profile, dependency graph, objectives, and course map are stable, select two to four lessons that exercise the course's hardest reasoning patterns. Use up to five when the user explicitly identifies a connected core sequence.

The set should include, where applicable:

- one foundational object/model lesson;
- one stateful or iterative mechanism;
- one implementation-facing lesson;
- one failure/recovery or proof-heavy lesson.

Record lesson numbers and selection reasons in the plan. Do not author the remaining course first.

## Build one vertical slice

For each Gold lesson:

1. complete the Mechanism Gate for every major concept;
2. write a source-grounded problem-driven narrative;
3. include the profile-appropriate complete trace;
4. add counterfactuals and misconception analyses;
5. build a varied practice rhythm and Assignment bridge;
6. render and test math, code, interactive behavior, and mobile flow;
7. review the learner outcome without using page length as evidence.

Compare the result with a mature CourseStack lesson that uses a similar reasoning mode. Compare causal completeness, trace quality, exercise density, and reading flow—not headings or word count.

## Human-quality self-review

Read the rendered lesson from top to bottom as a first-time learner. Then answer:

- Where does the page first ask me to believe a conclusion I could not derive?
- Which state transition is described but not shown?
- Which example stops before the difficult branch?
- Which wrong model would survive all current questions?
- Does provenance or history interrupt the main mechanism?
- Can I connect the lesson to a concrete Assignment decision or implementation condition?

Fix the evidence, not the label. A Gold candidate that fails any core depth outcome returns to authoring.

## Scale after the Gold gate

Only after the Gold lessons pass should the course expand. Use their reasoning primitives as a quality floor, not an HTML template.

- Reuse semantic components and practice behavior.
- Do not paste identical section names, traces, or question counts into every lesson.
- Match each lesson to its profile and conceptual load.
- Audit every remaining page; a page may honestly remain `SHALLOW` or `BLOCKED_BY_SOURCE`.
- Fix high-leverage prerequisite and continuity gaps before polishing low-impact pages.

## Course quality matrix

Maintain one row per lesson with observable evidence for:

```text
Source grounded | Problem driven | Mental model | Profile trace
Worked example | Counterfactual | Misconception analysis
Concept checks | Implementation/assignment mapping
Render validated | Status | Evidence / blocker
```

Allowed statuses:

- `GOLD` — passes every applicable gate and has been rendered and manually reviewed.
- `GOOD` — source-grounded and learnable, with adequate mechanism/practice depth for its role; not selected or not yet proven as the course's reference implementation.
- `SHALLOW` — a core why/trace/failure/state/implementation outcome remains unsupported.
- `BLOCKED_BY_SOURCE` — the official current-term source needed to write the missing content has not been published or is inaccessible. Name the exact missing source; never fill it from an older term as if current.

Do not mass-fill statuses. The report must point to page-specific evidence or a named blocker.

## Reverse validation of the Skill

After repairing the real course, compare the failures discovered during use with the new procedure:

1. Which failure would the new Source/Profile/Mechanism/Gold/Depth/Reading/Render gate catch?
2. Which failure still escaped structural checks and required human review?
3. Can the procedure distinguish `GOLD`, `GOOD`, `SHALLOW`, and `BLOCKED_BY_SOURCE` without relying on word count?
4. Do scripts report evidence rather than granting textbook quality automatically?
5. Would a fresh agent know when to stop researching, when not to write, and when scaling is allowed?

Update the Skill only for demonstrated reusable gaps. Do not encode one course's vocabulary as a universal rule.

