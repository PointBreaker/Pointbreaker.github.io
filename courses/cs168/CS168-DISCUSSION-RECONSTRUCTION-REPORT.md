# CS168 Discussion Reconstruction Report

## Outcome

All 13 existing Discussion pages were rebuilt from worksheet indexes into self-contained Guided Reasoning Workbooks. The structural coverage gate accounts for **225/225 substantive official subproblems**. D03 Routing I and D06 TCP are the Gold Standard pair; the remaining 11 pages are DIGESTED.

## Source and version boundary

For each discussion, authoring used both `.course-build/sources/discussions/discNN.pdf` and `discNN-sols.pdf`, extracted to local text for subproblem audit. The linked sheets identify themselves as Spring 2026. CourseStack retains Fall 2026 metadata and its under-construction source status; no unreleased Fall 2026 assignment content is claimed or invented.

The official PDFs remain provenance and source of truth. CourseStack uses original topologies, numbers, prose, hints, explanations, and variations to teach the same reasoning skills without reproducing the worksheets or solutions verbatim.

## Reconstruction inventory

| Discussion | Subproblems | Guided exercises | Worked trace/table activities | Variations | Wrong-turn diagnoses | Status | Reasoning clusters |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| D01 | 16/16 | 3 | 3 | 3 | 3 | DIGESTED | 把设计提案放进架构压力测试；TTL 到 0 后，到底诞生了哪个新 packet？；从嵌套 header 判定这是不是我的 probe |
| D02 | 12/12 | 3 | 2 | 3 | 3 | DIGESTED | 传播与发送：先比较量纲；两跳 store-and-forward 与第二包排队；sum of peaks 为什么不是 peak of aggregate |
| D03 | 22/22 | 4 | 3 | 4 | 4 | GOLD | 逐事件传播：谁此刻真的知道 D？；同一 failure 下比较三种 advertisement policy；把 stale belief 包装回来：Count to Infinity；Split Horizon 为什么救两节点但救不了任意环 |
| D04 | 15/15 | 3 | 1 | 3 | 3 | DIGESTED | belief path 与 actual packet path 可以不同；最短路、故障收敛与图割；Prefix 切分与 LPM transfer |
| D05 | 15/15 | 3 | 2 | 3 | 3 | DIGESTED | 用反例修正四个 BGP 断言；eBGP / iBGP / IGP 的消息接力；先画 export graph，再追 data path |
| D06 | 9/9 | 4 | 2 | 4 | 4 | GOLD | 滑动窗口遇到两个 loss；MTU → MSS → byte ACK；按正确顺序更新 RTO，再判断 window 是否够大；少发 ACK 的协议：先找最小反例 |
| D07 | 10/10 | 3 | 1 | 3 | 3 | DIGESTED | 先分清谁被保护、哪个 sample 可相信；同一 ACK timeline 对照 fast recovery；从锯齿面积推 throughput |
| D08 | 16/16 | 4 | 2 | 4 | 4 | DIGESTED | 用 state/failure 诊断 DNS 与 HTTP 断言；冷缓存、永久热缓存与有限 TTL；HTML 依赖、连接复用与并发 timeline；代理缓存的两条 TCP state 与 LRU |
| D09 | 18/18 | 3 | 2 | 3 | 3 | DIGESTED | 一个未知量对应一个协议；第一次公网访问：DHCP → ARP → frame → routing；NAT table 是可逆 demultiplex state |
| D10 | 17/17 | 3 | 2 | 3 | 3 | DIGESTED | STP 的局部 belief 与有效树；路径数不等于每个 flow 的带宽；Overlay 保留 tenant 地址，underlay 只看 tunnel endpoint |
| D11 | 21/21 | 4 | 2 | 4 | 4 | DIGESTED | 把一枚 packet 的工作分到 kernel、NIC 与 queue；SDN link-down 的 event→controller→rules 路径；重叠 tenant 地址如何靠 match-action 隔离；RDMA queue 与 completion 的端到端 timeline |
| D12 | 40/40 | 8 | 7 | 8 | 8 | DIGESTED | 七个断言，七次 state-placement 反例；DVMRP：receiver 变化不改另一 receiver 的 source-shortest path；CBT：三次 join 只增长一棵 shared tree；DVMRP 连续事件：membership、tree、table 与 arrival time；CBT join 停点、两位 sender 的延迟与 link failure；Full mesh：logical messages 如何叠到 underlay；Ring：按 step 顺序累计 latency 与 link bytes；只改 node ordering，就能改变同一 underlay 的性能 |
| D13 | 14/14 | 3 | 2 | 3 | 3 | DIGESTED | 无线共享介质与 cellular control plane；Attach 与 handoff 是多方状态迁移；RTS/CTS 如何让隐藏终端听见 receiver 的决定 |

## Gold Standard evidence

### D03 · Routing I

- Event-ordered DV convergence: each update names the router that has actually received an advertisement.
- Same-next-hop degradation: a worse metric must replace stale state when the route still depends on that neighbor.
- One topology is replayed under vanilla DV, split horizon, and poison reverse.
- Count-to-infinity is shown as alternating local beliefs and wire advertisements, followed by a three-node counterexample.
- Four prediction checks, progressive hints, interactive fillable traces, per-problem variations, misconception diagnosis, and a closed-book reconstruction.

### D06 · TCP

- Every segment is translated to a byte interval; cumulative ACK is treated as a proof boundary.
- Loss/window timeline tracks sender progress and receiver next expected byte.
- MTU→MSS, SYN sequence consumption, RTO update ordering, throughput, and BDP are derived with concrete values.
- Two proposed sparse-ACK schemes are tested with safety and liveness counterexamples.
- Four prediction checks, interactive state tables, progressive hints, misconception diagnosis, and a new loss reconstruction.

## Learning-loop integration

Every Discussion links back to its prerequisite Lesson at the point where the mechanism is needed. The corresponding Lessons now link directly into a concrete Discussion activity, including secondary links for HTTP, SDN, collectives, and cellular mobility. This keeps the roles distinct:

- Lesson: conceptual textbook.
- Discussion: guided hand derivation.
- Project: engineering / implementation workbook.

## Quality gates

- Anti-Outline: no page may consist only of official titles, generic hints, and PDF links.
- Coverage: every frozen substantive ID must appear in a full guided activity.
- Workbook loop: setup → prediction → work → three hints → reveal → why → wrong turn → variation.
- Status: GOLD additionally requires an interactive trace, misconception analysis, closed-book reconstruction, and at least four checks.
- Source fidelity: solutions were read for correctness and edge cases, never treated as copyable page text.

See [DISCUSSION-COVERAGE-AUDIT.md](DISCUSSION-COVERAGE-AUDIT.md) for the complete 225-row source fidelity matrix.
