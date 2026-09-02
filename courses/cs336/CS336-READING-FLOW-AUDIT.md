# CS336 Reading Flow Audit

审计日期：2026-08-31

范围：19 个 Lecture 页面、5 个 Assignment Guide，以及 `lesson-layout.js`、`assignment-workbook.js` 与相关 CSS。判断标准不是知识覆盖率，而是学习者能否始终辨认 Spring 2026 主线、当前问题、必要机制与下一章连接。

## 标记说明

- `KEEP`：位置与视觉权重合理。
- `MERGE`：内容有用，但应与相邻结构合并。
- `MOVE`：内容有用，但当前出现顺序打断推导。
- `COMPRESS`：信息要保留，但视觉或篇幅过重。
- `REMOVE_FROM_MAIN_FLOW`：不应进入 Spring 2026 学习主路径。

## Cross-course findings

1. 19 讲开头都依次出现 lede、metadata、source note、core-question bridge、learning map、prerequisite card、object map、worked example 与 misconception。内容本身正确，但首个正式 section 被推到多块 UI 之后：`MERGE + MOVE`。
2. Source provenance 在每页都是完整段落；Lecture 18–19 甚至有两个 source note。来源必须保留，但顶部只需一行摘要，详细边界放在可展开 metadata：`COMPRESS`。
3. 所有 Lecture 已有短 `lesson-connection`，因而跨课连续性不是内容缺失，而是 label 与视觉样式不统一：`KEEP + COMPRESS`。
4. Deep Dive 基本用于实现细节、硬件数字、可选推导与 reference，未发现把后续 prerequisite 大面积折叠的情况：`KEEP`。
5. Assignment active HTML 合计携带 118 道 Spring 2025 中文题面；A1/A5 分别约 125KB/137KB、79/88 个 `<details>`。即使 runtime 再套 archive 折叠，它们仍主导 DOM、下载体积与版本认知：`REMOVE_FROM_MAIN_FLOW`。
6. Assignment 的 2026 delta section 与 Workbook stage problem map 重复说明 current requirements；active narrative 应直接叫 Problem Guide，仅在页底保留 3–5 条 historical note：`MERGE + COMPRESS`。

## Lecture 1–19

| Lecture | Reading-flow finding | Action |
|---:|---|---|
| 01 Tokenization | 首屏教学块连续；BPE 主线完整 | `MERGE` opening；`MOVE` toy example 到机制之后 |
| 02 Resource accounting | 内容最长之一，开头与正文重复定义 FLOPs/memory 对象 | `MERGE` prerequisite + mental model；`KEEP` optional derivations |
| 03 Architecture | 主线连续；首屏卡片多于必要 | `MERGE` opening；`MOVE` example/misconception |
| 04 Attention alternatives + MoE | 2026 新内容多，开头同时比较 GQA/local/sparse/MoE，认知切换过早 | `MERGE` question/map/prerequisite；`MOVE` routing example；`KEEP` two-sparsity distinction |
| 05 GPUs, TPUs | 已有明确主问题，但又以独立 H2、bridge、map 重复出现 | `MERGE` duplicated question；`COMPRESS` source；`KEEP` GPU/TPU comparison |
| 06 Kernels, Triton | 与 L5 transition 清楚；benchmark question 在 hero 重复 | `MERGE` opening；`MOVE` fusion example 到 kernel mechanism 后 |
| 07 Parallelism | 主问题、bridge、object map 和 DDP example 同时抢首屏 | `MERGE` opening；`MOVE` DDP example；`KEEP` collectives prerequisite |
| 08 ZeRO/FSDP | 主线正确；12-element example 在 lifecycle 之前出现 | `MOVE` example 到 lifecycle；`MERGE` opening |
| 09 Scaling laws | 阅读路径稳定，仅有通用 opening 过载 | `MERGE` opening；其余 `KEEP` |
| 10 Inference | Deep dives 较多但属于可跳过 serving detail | opening `MERGE`；deep dives `KEEP` |
| 11 Scaling details | 拟合→诊断→外推连续 | opening `MERGE`；其余 `KEEP` |
| 12 Evaluation | 主线连续，卡片标签略密 | opening `MERGE`；保留 misconception emphasis |
| 13 Data sources | sources→records→datasets 连续 | opening `MERGE`；provenance `COMPRESS` |
| 14 Data pipeline | 过滤、去重、配比、合成四段较长但因果顺序正确 | opening `MERGE`；第二组 example/misconception `KEEP` 在对应 section |
| 15 SFT/RLHF | 阶段主线清楚 | opening `MERGE`；统一 post-training terminology |
| 16 RLVR | verifier、GRPO、on/off-policy 信息密集；toy rollout 在正式 GRPO 前出现 | `MOVE` toy rollout 到 GRPO；`MERGE` opening；source `COMPRESS` |
| 17 Multimodality | 内容较短，但开头 5 个教学块占比尤其高 | `MERGE` opening；`MOVE` resolution example 到 visual-token section |
| 18 Daniel Selsam | 官方只确认 guest lecturer，顶部两段 provenance 打断阅读 | `MERGE` source boundary；保留 contextual-guide 声明 |
| 19 Dan Fu | 同 L18 | `MERGE` source boundary；保留 contextual-guide 声明 |

## Assignment 1–5

| Assignment | Active page finding | Action |
|---:|---|---|
| A1 Basics | 39 个 2025 problem rows、旧知识树/quiz 与 2026 Workbook 并存 | `REMOVE_FROM_MAIN_FLOW`；完整旧页移至独立 archive；2026 stages 成为 Problem Guide |
| A2 Systems | 22 个旧题面 + 2026 authoritative delta；bucketed DDP 历史占据过多空间 | `REMOVE_FROM_MAIN_FLOW`；只保留 3–5 条 historical changes；A2 stage map 直接表达 current requirements |
| A3 Scaling | 旧内容较少，但 online-API delta 与 stages 重复 | `MERGE` current workflow into stage contracts；旧页移 archive |
| A4 Data | 14 个旧题面与 2026 WET/B200 delta 重复 | `REMOVE_FROM_MAIN_FLOW`；current population/recipe 由 stages 表达；旧页移 archive |
| A5 Alignment | 43 个 2025 Qwen/MATH rows 与 OLMo/GSM8K active workflow 同页，是最大版本干扰 | `REMOVE_FROM_MAIN_FLOW`；只留简短 Qwen/MATH→OLMo/GSM8K historical note；旧页移 archive |

## Target flow

Lecture：`title + lede → compact source → core question / 30-second model / prerequisite（一个 opening）→ object relationship → mechanism → worked example → misconception → Next`。

Assignment：`mission → capability/stage map → stage contracts + problem IDs → debugging/experiment/gates → official sources → short historical note`。Spring 2025 完整页面保存在独立 archive，不参与 active curriculum DOM。
