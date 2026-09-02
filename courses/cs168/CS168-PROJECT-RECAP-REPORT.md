# CS168 Project Recap Refactor Report

审计日期：2026-09-02
版本边界：Fall 2026 official spec ≠ historical PointBreaker implementation

## 结果

- Project 1A / 1B 没有 PointBreaker 历史实现证据，保持 **Engineering Workbook**；补齐 prediction→experiment→evidence、Lesson 机制回链与 closed-book reconstruction，状态为 `GOLD`。
- Project 2 改为 **Historical Implementation Recap**，当前官方 Project 2 与 2023 个人实现并列但不混同，状态为 `GOLD`。
- Project 3 改为深度 **Historical Implementation Recap**；历史教材深度为 `GOLD`，但 Fall 2026 Project 3 尚未发布，当前兼容状态必须是 `BLOCKED_BY_SOURCE`。

## Source files used

### Routing

- `simulator/dv_router.py`
- `routing.pdf`
- `simulator/dv_unit_tests.py`
- `simulator/dv_comprehensive_test.py`
- `simulator/cs168/*.topo`
- Git commits `b24f303`, `aeb91c4`, `46e7c30`, `15ff0ea`

### Transport

- `proj2_transport/pox/ext/cs168p2/student_socket.py`
- `transport.pdf`
- `proj2_transport/pox/ext/cs168p2/tests/*`
- framework context `proj2_transport/pox/ext/tcpip/tcp_sockets.py`
- Git commits `b0dbaf1`, `eb226bc` through `34af76a`, especially `29fb2ce` and `34af76a`

## Attribution evidence

Routing root commit contains the framework classes, APIs, callback signatures and TODO markers. The root-to-head diff supports attribution of the seven filled handler paths and `history` to the historical user implementation. Transport root commit already contains `TXControlBlock`, `RXControlBlock`, `FinControl`, `RetxQueue`, much of `acceptable_seg`, and the socket framework; only stage-marker diffs are labeled user implementation. Framework code is never labeled `YOUR CODE`.

## Key invariants and traces

- Routing: current-next-hop bad news must be accepted; `history[(dst, outgoing_port)]` records a different advertised value per neighbor; expiry and link events must turn stale local state into a propagated update; data forwarding uses only a finite current route.
- Transport: `SND.UNA/NXT` bound sent sequence space; RetxQueue contains data not yet proven safe by cumulative ACK; RecvQueue retains out-of-order evidence without advancing `RCV.NXT`; receive-window checks use serial arithmetic; FIN follows pending application bytes.
- Added full routing candidate/update/advertisement trace and full TCP loss → out-of-order → timeout → retransmit → ACK 300 trace.

## Evidence-backed bug reconstructions

1. Routing Stage 10 commits explicitly progress from “still has some bug” to the final fix. The diff shows history moving from one value per destination to one value per destination/outgoing-port. The Recap reconstructs the mistaken one-dimensional model and proposes a per-neighbor send-count regression test.
2. Transport Stage 9 handout requires RTO doubling, while commit `29fb2ce` only clamps the unchanged value with `min(rto, MAX_RTO)` and says only two Stage 9 tests passed. The Recap derives repeated-timeout failure and a 1→2→4→MAX test.
3. Commit `34af76a` explicitly fixes “bytes in fly bug” by adding `SND.NXT-SND.UNA` to the send gate. The Recap connects the diff to the invariant that window is a budget over all unacknowledged bytes.

## Links and exercises

Project 2 links contextually to L5–L9; those Lessons link back to the exact state/update/policy sections. Project 3 links to L11–L13; those Lessons link back to the loss trace, control block and RTO bug. Both Recaps add delete-a-condition code predictions and closed-book reconstruction instead of function-name recall.

## Skill changes

Course Authoring now has a reusable Historical Implementation Recap Profile plus `audit_workbook_depth.py`. It separates recap depth from current-source compatibility and prohibits invented bugs or unverified `YOUR CODE` attribution.

## QA status

Automated structure, links, quiz IDs, CourseStack validation, math/render signatures and browser desktop/mobile checks are recorded in the final task validation. Structural auditors are regression detectors; the attribution and Gold judgments above were also manually checked against diffs, specs and tests.
