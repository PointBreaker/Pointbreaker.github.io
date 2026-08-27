# CS336 Assignment Workbook 重构报告

日期：2026-08-27

## 本轮结论

Lesson 继续承担 **Interactive Textbook**；Assignment 1–5 已统一为数据驱动的 **Engineering Workbook**。本轮没有继续大规模扩写 Lesson 正文，而是收紧技术表述、练习节奏、Lesson ↔ Assignment 路径和内容回归检查。

Assignment 页面保留原有中文导读、知识树、Cheatsheet、官方题面、官方编号和来源链接；这些长参考材料被收进默认折叠的 `Deep Reference`。Workbook 主线改为：

```text
Prerequisite
→ Contract / Invariants
→ Tiny Sanity Check
→ Implementation
→ Official Checks
→ Prediction / Experiment
→ Explanation
→ Gate
```

## Lessons

### 技术表述同步

- Lesson 1：tokenizer efficiency 统一为 `bytes/token`；明确 pre-token boundary invariant，并禁止容易误导的 `"cat" + "erpillar"` 示例。
- Lesson 4：`O(n²)` 只描述 naive attention intermediate compute / memory；decode KV cache 另行标明随 cached context length 线性增长。
- Lesson 8：FSDP 表述为 PyTorch 原生 fully sharded data parallelism；`FULL_SHARD` 与 ZeRO Stage 3 是状态分片思想高度类似，不作实现等同。
- Lesson 10：local-attention KV cache 表述为受 attention window size 上界约束；保留严格的 speculative decoding acceptance probability 和 AWQ activation-aware scaling 描述；速度数据明确标为 paper-specific 或 benchmark-specific。

### Adaptive Follow-up

- Inline Concept Check 始终处于正文学习流中。
- 首题答错：自动显示错误原因、对应 misconception、机制回顾和 Follow-up Check。
- 首题答对：不强制第二题，只显示默认折叠的“再验证一次”。
- 课末命名统一为“综合理解验证 · Deep Quiz”和“闭卷自测 · Explain It Yourself”。
- Lesson 1–16 的闭卷区之后增加 `Learn → Build → Return`，直达对应 Assignment stage；Lesson 17–19 没有强行绑定不匹配的作业。

### Content lint

新增 `tools/lint-cs336-content.mjs`，检查：

- Lesson 1 / 4 / 8 / 10 的必需准确表述与禁止短语。
- `TEACHING-EXPERIENCE-AUDIT.md` 中“已修复”声明必须能在实际正文中检测到。
- Assignment 1–5 的 stage 数量和数据结构。
- 每个 stage 必须有 build、why、readiness、official mapping、contract、Definition of Done、sanity check、至少 2 个 failure signatures、3 层 hints、完整五步实验循环和 Lesson links。
- 每个 Assignment 页面必须加载共享 workbook data / renderer。
- 52 个 Assignment → Lesson section links 必须指向真实 HTML anchor；16 个 Lesson → Assignment links 必须指向真实 stage ID。

运行：

```bash
node tools/lint-cs336-content.mjs .
```

## Assignment 1–5

下表中的 Hint sets 均为三级 Hint；Prediction / experiment blocks 都包含 `Hypothesis → Prediction → Controlled Experiment → Observation → Explanation`。

| Assignment | Stages | Gates | Contracts | Sanity checks | Failure signatures | Hint sets | Prediction / experiment | Lesson cross-links |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 · Basics | 4 | 4 | 4 | 4 | 8 | 4（12 层） | 4 | 8 |
| 2 · Systems | 6 | 6 | 6 | 6 | 12 | 6（18 层） | 6 | 12 |
| 3 · Scaling | 5 | 5 | 5 | 5 | 10 | 5（15 层） | 5 | 9 |
| 4 · Data | 6 | 6 | 6 | 6 | 12 | 6（18 层） | 6 | 11 |
| 5 · Alignment | 6 | 6 | 6 | 6 | 12 | 6（18 层） | 6 | 12 |

### Assignment 1 · Basics

4 个 stage：Tokenizer、Transformer Forward、Optimization、Training System。重点把 official problems 从平铺题目变为四个可运行对象，并加入 BPE determinism / Unicode round-trip、attention causal invariant、AdamW 单参数手算、checkpoint resume continuity 等最小证据链。

### Assignment 2 · Systems

6 个 stage：Measure、Trade Compute for Memory、Move Less Data、Overlap Communication、Shard Model State、Multi-dimensional Parallelism。所有性能结论要求 `Baseline / Configuration / Measurement method / Result / Explanation`；FlashAttention、DDP overlap、FSDP peak lifecycle 和 mesh accounting 都要求先预测后 profile。

### Assignment 3 · Scaling

5 个 stage：Controlled Experiments、Fit Scaling Curves、Validate Fit Quality、IsoFLOPs、Careful Extrapolation。实验 contract 强制记录 fit region、holdout、residual、extrapolation range 和 uncertainty，避免把训练点内的好拟合误写成远距离外推真理。

### Assignment 4 · Data

6 个 stage：Extract、Filter、Deduplicate、Tokenize、Build Pipeline、Evaluate Through Training。每一阶段记录 input population、criterion、kept / removed ratio、false-positive risk 和 bias risk；dedup 明确区分 exact、near duplicate 与 MinHash estimate。

### Assignment 5 · Alignment

6 个 stage：Baseline、Rollout Contract、On-policy GRPO、Variants & Ablations、Off-policy GRPO、Safety & Preference Evaluation。Spring 2026 主线以 reasoning RL / GRPO 为准；SFT / DPO / safety 作为可选 supplement 明确标记。证据模板区分 Objective、Proxy、True desired behavior、Potential exploit 和 Evaluation evidence。

## UX

### Desktop

- Workbook 主内容约 860px，右侧 200–220px sticky stage navigation。
- 顶部 Stage Map 支持直接跳转；当前 stage 随滚动高亮。
- Gate 只显示克制的能力验证进度，不使用 XP、streak、徽章或硬锁。
- Stage 内容以分隔和排版层级为主，Contract / Failure / Hints 等才使用轻 callout，避免 card wall。

### Mobile

- 单栏内容；Stage navigation 变为可横向滚动的 sticky row。
- Contract、Definition of Done 和 experiment grid 自动降为单列。
- code / long identifiers 在局部容器滚动，页面本身不产生 horizontal overflow。

### Long-page reading

- Workbook 主线优先显示当前工程阶段所需的信息。
- Readiness、failure diagnosis 与三级 hints 默认折叠，减少连续“考试感”。
- 原有长中文导读和完整题面统一放入默认折叠的 `Deep Reference`，不删除有价值内容。

### Official / legacy hierarchy

- 页面顶部固定显示 Official version、Workbook basis、Legacy / optional boundary 和 official source links。
- 官方 handout / repository 决定题号、接口、约束和 deliverables。
- Assignment 1 / 3 / 4 的 Spring 2025 本地化题面标注 `Legacy Reference`。
- Assignment 5 的 SFT / DPO / safety 内容标注为 optional supplement，不与 Spring 2026 reasoning-RL 主线混淆。

## 实现结构

- `assets/assignment-bank.js`：Assignment 1–5 的结构化 workbook data。
- `assets/assignment-workbook.js`：共享 renderer、stage navigation、Gate / capability progress、reference hierarchy。
- `assets/guide.css`：Assignment 专用 responsive visual system。
- `assets/deep-practice.js`：Lesson adaptive follow-up behavior。
- `assets/lesson-layout.js`：Lesson → Assignment stage-level bridge。
- `tools/lint-cs336-content.mjs`：关键内容与 workbook schema regression。

## 仍需人工定期复核

- Spring 2026 handout / repository 后续 version、problem ID、接口和测试变更。
- 硬件、driver、compiler、shape 与 dtype 相关的 benchmark 数字；这些不能脱离测量条件复用。
- PyTorch FSDP API、mixed-precision policy、prefetch / reshard lifecycle 的版本差异。
- Scaling-law 的经验拟合区间、数据质量和远距离 extrapolation claims。
- GRPO / off-policy estimator、reward parsing、safety / preference evaluation 的课程实现细节。

本次核对基线：Assignment 1 `v26.0.3`、Assignment 2 `v26.1.3`、Assignment 3 `v26.0.5`、Assignment 4 `v26.0.1`、Assignment 5 主作业及 safety supplement `v26.0.0`。后续课程源更新时，应先更新版本信息与 official problem map，再修改 Workbook。
