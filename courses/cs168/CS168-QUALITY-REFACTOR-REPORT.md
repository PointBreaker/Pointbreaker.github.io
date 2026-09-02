# CS168 Quality Refactor Report

审计日期：2026-09-02（Asia/Shanghai）  
课程：UC Berkeley CS 168 · Fall 2026  
课程类型：Networking / Distributed Systems  
Gold lessons：L3、L6、L8、L11、L12

## Source snapshot 与边界

- [Fall 2026 官方站](https://fa26.cs168.io/) 当前仍标注 **under construction**；日期和政策可能变化，因此 `sourceStatus` 原样保留。
- [官方在线教材](https://textbook.cs168.io/) 是本轮机制解释的主要公开来源。
- 官方 Project 1 与 [Project 2](https://fa26.cs168.io/proj2/) 已有当前页面；Project 3 仍未发布，状态为 **BLOCKED_BY_SOURCE**，没有补写未来接口或任务。
- [PointBreaker/routing](https://github.com/PointBreaker/routing) 与 [PointBreaker/transport](https://github.com/PointBreaker/transport) 只作为历史实现证据，用于 invariant、bug 与实现条件复盘；不声称是 Fall 2026 solution。
- 课程阶段、Fall 2026 metadata、官方 provenance、17 个 Discussion/Project Workbook、既有 interactive infrastructure 全部保留。

## 基线审计

改动前 26/26 lesson 都只有 1 道 quiz，典型结构是“核心问题 → 3–4 节概述 → 一句纠错 → 一题结束”。桌面与移动截图确认页面视觉整洁，但机制一进入关键状态演化就结束。L11 还存在 `SND.UNAle ...`、RTO 公式控制字符和未渲染 LaTeX；四个核心 stepper 各只有 4 个概述步骤。

这说明旧课程是高质量 lecture notes，而不是学习者能闭卷重建机制的 interactive textbook。

## Gold lesson 修复结果

### L3 · Layers / Headers

新增 Browser → HTTP → TCP → IP → Ethernet → Router → new frame → Destination 的完整 packet journey。每步写明添加/移除的 header、谁解析、MAC/IP/port/TTL 的变化与不变量；Packet Trace 要求学习者填写路由器转发后的七个字段。反事实展示“MAC 不逐跳更换”和“IP 被改成 next hop”分别如何失败。

### L6 · Distance Vector

保留 Bellman–Ford、count-to-infinity、split horizon、poison reverse 与历史 routing 实现。新增 A—1—B—2—C—1—D 的逐 round convergence table；C—D 断开后对照无保护 / split horizon / poison reverse。实现表明确 `route table`、`history[(dst, port)]`、expiration、next hop 与 metric 在 link/update/timer event 中如何共同更新。

### L8 · Routers / Forwarding

新增具体包 `dst=10.1.2.99, TTL=2` 与 `/8, /16, /24, default` FIB，完整执行 validate → TTL → LPM → adjacency → queue → emit，并列出每阶段失败出口。通过旧 FIB 尚未收敛的反例区分 routing plane 与 forwarding plane。

### L11–12 · TCP

L11 逐步模拟 `[100,200)` 丢失、`[200,300)` 乱序到达、ACK 100、timeout、重传、一次消费两段、ACK 300；每行同时显示 `SND.UNA/NXT/WND`、retx queue、`RCV.NXT`、OOO queue、timer 与 wire output。L12 补充握手 TCB 原子更新、接收窗口裁剪/合并、32 位序号回绕和 timeout audit。Reliability / Flow Control / Congestion Control 用三种具体 failure scenario 分离。所有 RTO 与 sequence-space 公式已改为受支持的 KaTeX delimiters。

## 扩展策略

Gold slice 自评通过后，剩余 lesson 按主题增加一段专属 mechanism lab、counterfactual、诊断题与 Explain It Yourself：routing 追 topology/table，transport 追 window/timeline，applications 追 end-to-end messages，datacenter 追 topology/traffic，wireless 追 channel/state/time。它们没有机械升级为 Gold，仍保留 `GOOD`，因为 misconception 多数还没有 Gold 课的三段式深度。

## 逐课质量矩阵

说明：`强` 表示完整逐步机制；`短` 表示本轮新增的主题专属 before/event/after 推演；`基础` 表示已有具体纠错但尚未达到 Gold 的“诱因→反例→替代模型”。Render 栏在最终浏览器 QA 后填写。

| Lesson | Source grounded | Problem driven | Mental model | Packet/state/table trace | Worked example | Counterfactual | Misconception | Concept checks | Implementation mapping | Render validated | Status |
|---|---|---|---|---|---|---|---|---:|---|---|---|
| L1 Architecture | 是 | 是 | 是 | 短·packet/state | 短 | 是 | 基础 | 2 | 架构接口 | Desktop + Mobile | GOOD |
| L2 Links | 是 | 是 | 是 | 短·queue/time | 短 | 是 | 基础 | 2 | queue/scheduler | Desktop + Mobile | GOOD |
| L3 Layers | 是 | 是 | 是 | **强·Packet Trace** | **完整旅程** | 是×2 | **三段式** | 6 | Project 1 parser invariant | Desktop + Mobile | **GOLD** |
| L4 Principles | 是 | 是 | 是 | 短·end-to-end | 短 | 是 | 基础 | 2 | 应用幂等边界 | Desktop + Mobile | GOOD |
| L5 Routing model | 是 | 是 | 是 | 短·route state | 短 | 是 | 基础 | 2 | next-hop/port | Desktop + Mobile | GOOD |
| L6 Distance Vector | 是 | 是 | 是 | **强·Table Trace + failure** | **完整 4 节点** | 是 | **三段式** | 7 | 历史 routing state | Desktop + Mobile | **GOLD** |
| L7 Link State | 是 | 是 | 是 | 短·LSDB/SPF | 短 | 是 | 基础 | 2 | topology→FIB | Desktop + Mobile | GOOD |
| L8 Routers | 是 | 是 | 是 | **强·Packet/FIB** | **完整 pipeline** | 是 | **三段式** | 6 | per-stage invariant | Desktop + Mobile | **GOLD** |
| L9 BGP Policy | 是 | 是 | 是 | 短·route policy | 短 | 是 | 基础 | 3 | import/select/export | Desktop + Mobile | GOOD |
| L10 BGP Impl | 是 | 是 | 是 | 短·RIB/FIB | 短 | 是 | 基础 | 2 | Adj-RIB/Loc-RIB | Desktop + Mobile | GOOD |
| L11 TCP Reliability | 是 | 是 | 是 | **强·双端 state timeline** | **完整 loss recovery** | 是 | **三段式** | 7 | 历史 transport invariants | Desktop + Mobile | **GOLD** |
| L12 TCP Design | 是 | 是 | 是 | **强·TCB/state machine** | **握手+接收队列** | 是 | **三段式** | 7 | handler/queue/timer audit | Desktop + Mobile | **GOLD** |
| L13 CC Principles | 是 | 是 | 是 | 短·cwnd event | 短 | 是 | 基础 | 2 | cwnd/rwnd split | Desktop + Mobile | GOOD |
| L14 CC Models | 是 | 是 | 是 | 短·throughput | 短 | 是 | 基础 | 2 | parameter regime | Desktop + Mobile | GOOD |
| L15 DNS | 是 | 是 | 是 | 短·message/cache | 短 | 是 | 基础 | 3 | resolver cache | Desktop + Mobile | GOOD |
| L16 HTTP/CDN | 是 | 是 | 是 | 短·request/cache | 短 | 是 | 基础 | 2 | cache key/freshness | Desktop + Mobile | GOOD |
| L17 Ethernet/STP | 是 | 是 | 是 | 短·table/tree | 短 | 是 | 基础 | 2 | learning/blocked port | Desktop + Mobile | GOOD |
| L18 ARP/DHCP/NAT/TLS | 是 | 是 | 是 | 短·packet/table | 短 | 是 | 基础 | 3 | NAT mapping | Desktop + Mobile | GOOD |
| L19 DC Topology | 是 | 是 | 是 | 短·topology/traffic | 短 | 是 | 基础 | 2 | ECMP load | Desktop + Mobile | GOOD |
| L20 DC Routing | 是 | 是 | 是 | 短·inner/outer packet | 短 | 是 | 基础 | 2 | underlay/overlay | Desktop + Mobile | GOOD |
| L21 SDN | 是 | 是 | 是 | 短·table miss | 短 | 是 | 基础 | 3 | Packet-In/Flow-Mod | Desktop + Mobile | GOOD |
| L22 Host Networking | 是 | 是 | 是 | 短·buffer/event | 短 | 是 | 基础 | 2 | ownership/batching | Desktop + Mobile | GOOD |
| L23 Overlay/Multicast | 是 | 是 | 是 | 短·tree copies | 短 | 是 | 基础 | 2 | group/tree state | Desktop + Mobile | GOOD |
| L24 AI Collectives | 是 | 是 | 是 | 短·shard timeline | 短 | 是 | 基础 | 3 | topology mapping | Desktop + Mobile | GOOD |
| L25 Wireless | 是 | 是 | 是 | 短·channel/time | 短 | 是 | 基础 | 2 | backoff state | Desktop + Mobile | GOOD |
| L26 Cellular | 是 | 是 | 是 | 短·handover state | 短 | 是 | 基础 | 2 | bearer/forwarding | Desktop + Mobile | GOOD |

## Depth self-review

五个 Gold lesson 均已按闭卷标准人工复核：学习者可以定位 packet、列 header、指出设备 state/table、执行 event transition、预测 packet loss/link failure/ACK reordering，并把实现条件连接到 invariant。其余课达到 `GOOD`：已经不再只有定义与单题，但不会因新增相同 class 就宣称 `GOLD`。

## Source-blocked 项

| Item | Status | Reason | Safe current behavior |
|---|---|---|---|
| Fall 2026 Project 3 | BLOCKED_BY_SOURCE | 官方页尚未发布 | 只展示历史 transport 复盘，明确非当前 solution；等官方 spec 发布后重新做 version audit |

## 自动与浏览器 QA

- `validate_course.py`：44 个 HTML page、26 个 lecture、17 个 work item、10 个 interactive embed 全部通过；数学 cache version、控制字符、分隔符、链接、quiz 与 source section 检查为 0 error。
- `audit_lesson_depth.py`：5 个 Gold lesson 均有 7/7 结构证据；quiz 数为 L3=6、L6=7、L8=6、L11=7、L12=7。其余 lesson 为 2–3 道，并明确保持 `GOOD`。
- Firefox runtime：Dashboard 与全部 43 个内容页逐页加载；无 page-level overflow、无 KaTeX error、无残留损坏公式、无未完成 interactive，且每页恰有一个 H1。
- Mobile runtime：L3/L6/L8/L11/L12 与 Project 2 Workbook 在 390×844 逐页检查；无 page-level overflow 或数学错误。宽表由局部滚动容器承载。
- 行为检查：实际点击 L3 stepper 的下一步，内容发生状态变化；实际选择错误 quiz option，诊断反馈可见。10/10 JSON spec 与 10/10 SVG fallback 通过 validator。
- 视觉复核：对照改动前后桌面 L3 与移动 L12。保留原 CourseStack typography/design system；将历史代码证据合并进单一 source snapshot，避免两张 metadata 卡占满移动首屏。

本报告没有把“HTML 中存在公式”“JSON 文件存在”或“push 成功”当作 render / deploy 通过；发布后仍需检查远端 commit 与公开 URL。
