# Course type profiles

Choose one primary profile before planning lessons. Add a secondary profile only when a substantial part of the course actually uses its reasoning objects. The profile changes examples, traces, exercise types, and implementation bridges; it is not a catalog tag or a cosmetic template.

Record the choice and evidence in the course plan:

```json
{
  "courseTypeProfiles": ["networking-distributed-systems"],
  "profileEvidence": "Most core lectures reason about packets, local tables, messages, failures, and event-driven state transitions."
}
```

## ML / AI

Default reasoning objects:

```text
tensor | shape | representation | data flow | parameter
activation | gradient | compute | memory | numerical precision
```

Required teaching moves for a core mechanism:

- trace a small tensor through shapes and operators before scaling up;
- distinguish mathematical objects from their stored layouts and framework views;
- expose saved activations, parameters, gradients, and optimizer state;
- show how a forward choice changes backward computation and resource cost;
- include a counterfactual with a wrong shape, mask, reduction, gradient path, or precision choice.

Preferred practice: tensor-shape trace, dataflow trace, resource ledger, gradient-path prediction, controlled ablation, and implementation-condition explanation.

## Networking / Distributed Systems

Default reasoning objects:

```text
packet | state | table | event | message | timeline
invariant | failure | recovery | local knowledge | output
```

Use the event transition as the organizing equation:

```text
packet/message + local state/table + event
→ transition
→ new state + emitted packet/message/action
```

Required teaching moves for a core mechanism:

- identify what the current device knows and cannot know;
- trace at least one packet/message through every state and table mutation;
- separate control-plane state from data-plane action when applicable;
- inject loss, delay, duplication, reordering, restart, or link failure where the source model permits it;
- map an implementation condition to the invariant it protects.

Preferred practice:

- **Packet Trace** — source/destination MAC, source/destination IP, TTL, ports, and which fields change at each hop;
- **State Trace** — before state, input event, accepted/rejected decision, mutation, output, after state;
- **Table Trace** — routing, forwarding, ARP/neighbor, DV, BGP, receive, or retransmission table evolution;
- **Timeline** — sender, network, receiver, timeout/ACK/failure ordering;
- **Failure Injection** — predict the first violated invariant and the observable symptom.

## Algorithms

Default reasoning objects:

```text
input | state | iteration | invariant | choice | counterexample
complexity | termination | reconstruction
```

Required teaching moves for a core mechanism:

- run the algorithm on a small nontrivial input with state after every iteration;
- state initialization, maintenance, termination, and how they imply correctness;
- show a tempting alternative and the smallest counterexample that defeats it;
- derive time and space complexity from counted operations or states;
- include a transfer case whose surface details differ from the worked example.

Preferred practice: invariant repair, next-state prediction, counterexample construction, recurrence/table trace, exchange argument, and complexity derivation.

## Theory

Default reasoning objects:

```text
definition | intuition | quantifier | lemma | derivation
proof obligation | counterexample | boundary case
```

Required teaching moves for a core mechanism:

- unpack every quantifier and object type before using a theorem;
- separate intuition from the formal statement;
- expose the proof plan and the role of each lemma;
- include a near-miss statement with a counterexample;
- ask the learner to reconstruct a missing proof step or choose a witness.

Preferred practice: definition discrimination, witness construction, proof-step ordering, assumption removal, counterexample, and transfer to a neighboring theorem.

## Mixed courses

Choose a primary profile for the course and annotate only the lessons that genuinely need a secondary profile. For example, a networking course with an algorithms unit may use the Networking profile course-wide and the Algorithms profile for shortest-path proofs.

Do not create a hybrid page by pasting every profile's headings. Select the smallest set of teaching primitives that makes the lesson's mechanism reproducible.

