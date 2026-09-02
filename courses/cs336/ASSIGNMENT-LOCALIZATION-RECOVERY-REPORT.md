# CS336 Assignment 中文题面恢复审查报告

日期：2026-08-27

> **Historical report:** 本报告记录 2026-08-27 的翻译资产恢复状态，不描述当前页面层级。2026-08-31 的 reading-flow 整理已把五份 Spring 2025 完整中文题面移到独立 archive 页面；active Assignment 只呈现 Spring 2026 Workbook、problem guide 与官方来源。题面内容与 problem IDs 仍完整保留，当前结构见 `CS336-READING-FLOW-REPORT.md`。

## 结论

五份 Assignment 的中文题面没有从仓库中丢失。与提交 `34ceb15 feat: localize complete CS336 assignment handouts` 对比后，当前 HTML 中的 problem 数量、顺序和 problem ID 完全一致：

```text
Assignment 1    39 / 39
Assignment 2    22 / 22
Assignment 3     3 / 3
Assignment 4    14 / 14
Assignment 5    43 / 43
```

因此本轮从 Git 历史恢复的译文数量为 **0**。真正的恢复工作是信息架构恢复：上一版 renderer 把这 118 道题统一移动进 `Deep Reference`；Assignment 2 和 5 的题面还保留了外层 `Legacy Supplement <details>`，形成两层以上折叠。本轮已将全部 118 道题提升为一级 `完整中文题面`，并移除 problem 外层的折叠容器。

## 恢复与映射统计

`2026 ID matched` 只表示 Spring 2026 Workbook problem ID 能解析到现有中文题面，不表示该中文题面的接口、测试、硬件条件或 deliverables 已逐题验证为 2026 兼容。

| Assignment | Translated problems found | 从 Git 恢复 | 提升为 Core | 2026 ID matched | Current-version verified | 2025-only / unmapped | Missing translation | Workbook links resolved |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 · Basics | 39 | 0 | 39 | 38 | 0 | 1 | 0 | 38 |
| 2 · Systems | 22 | 0 | 22 | 18 | 0 | 4 | 9 | 18 |
| 3 · Scaling | 3 | 0 | 3 | 2 | 0 | 1 | 0 | 2 unique IDs / 7 stage links |
| 4 · Data | 14 | 0 | 14 | 13 | 0 | 1 | 0 | 13 |
| 5 · Alignment | 43 | 0 | 43 | 21 | 0 | 22 | 23 | 21 |

`Current-version verified` 暂记为 0，是刻意保守的版本声明。Spring 2026 problem map 已依据官方 handout / repository 对齐，但旧中文正文仍主要来自 Spring 2025，不能只凭 ID 相同就声称接口兼容。

## 新的信息架构

每个 Assignment 现在有三个同级入口：

```text
Engineering Workbook
中文完整题面
Official Handout
```

- Workbook 保留 Stage、Gate、Contract、Definition of Done、Sanity Check、Failure Signatures、Hints 和实验循环。
- 中文完整题面拥有独立 Version Notice、覆盖统计、按 Stage 分组的 Problem Index 和逐题折叠内容。
- Official Handout 独立展示 repository、README、PDF、课程日程和已有 Spring 2026 authoritative problem map。
- Deep Reference 只保留旧版导读、知识树、Cheatsheet、历史接口说明和其他 secondary material；其中不再包含 `.problem-row`。

## Stage ↔ Problem 连接

- 每个 localized problem 根据 `.problem-number` 获得稳定 anchor：`#problem-<problem-id>`。
- Workbook 的 official problem ID 若有中文题面，显示 `中文题面 →` 并直接链接；若没有，显示 `Official only · 待中文覆盖`，不静默失败。
- 点击 Stage problem link 或 Problem Index 后，目标 problem 自动展开、获得键盘 focus 并短暂高亮；动画遵循 `prefers-reduced-motion`。
- 每个已映射中文 problem 顶部显示 `← Stage NN · Stage title`；2025-only problem 明确标记尚未映射。
- Assignment 3 的 `scaling_laws` / `chinchilla_isoflops` 会服务多个 research stage，因此保留多个 Stage backlink，而不复制题面。

## 版本边界

### Assignment 1

- 38 个 Spring 2026 ID 可映射到现有中文题面。
- `setup` 仅属于 2025 localized handout。
- `adamw_accounting` 与旧题面 ID `adamwAccounting` 通过规范化匹配建立导航，但旧 ID 本身没有被修改。

### Assignment 2

- 18 个 ID 可映射。
- 2025-only：`setup`、`ddp_overlap_bucketed`、`ddp_bucketed_benchmarking`、`communication_accounting`。
- 尚无完整中文题面：`gradient_checkpointing`、`fsdp`、`fsdp_accounting`、`alternate_ring_all_reduce`、`data_parallel_calcs`、`fsdp_calcs`、`tp_calcs`、`fsdp_tp_calcs`、`leaderboard`。

### Assignment 3

- `scaling_laws` 与 `chinchilla_isoflops` 两个 2026 ID 均有旧中文题面。
- `setup` 属于 2025 localized handout。
- hosted API、预算和 leaderboard 条件仍需按 Spring 2026 v26.0.5 人工核验。

### Assignment 4

- 13 个 Spring 2026 ID 均可映射。
- `setup` 属于 2025 localized handout。
- 即使 ID 相同，schema、训练入口和目标硬件仍需按 Spring 2026 v26.0.1 核验。

### Assignment 5

- 21 个 Spring 2026 main / optional-supplement ID 可映射；其中 SFT、DPO 和 safety evaluation 明确属于 optional supplement。
- Spring 2026 reasoning-RL / GRPO 主线有 23 个新或重构 ID 尚无完整中文题面。
- 22 个旧主线 problem 只保留为 2025-only / unmapped；它们不能替代 2026 的 Dr. GRPO、MaxRL、GSPO 和新 estimator 题目。

## Regression checks

`tools/lint-cs336-content.mjs` 现在验证：

- Assignment 1–5 的 localized problem count 固定为 `39 / 22 / 3 / 14 / 43`。
- 每页仍包含 `Handout 完整本土化` 和 `完整任务` 标记。
- problem IDs 唯一。
- Workbook stage official IDs 被分类为 matched、official-only 或 legacy-only，并与预期计数对比。
- renderer 使用 `translatedProblems / officialSourceContent / legacyGuide / legacySupplement / miscReference` 语义分类。
- 禁止重新引入 `oldNodes` 无差别收集逻辑。
- Problem anchor、自动展开与 `data-problem-target` 链路必须存在。

## 仍需人工版本核验

- Assignment 1 的 2026 tokenizer / optimizer 接口、tests 和 accounting deliverables。
- Assignment 2 的 FSDP、parallelism calculations、B200 benchmark 条件。
- Assignment 3 的 hosted API、budget、fit / leaderboard submission contract。
- Assignment 4 的数据 schema、pipeline entry points 与目标硬件。
- Assignment 5 的 2026 GRPO estimator、off-policy / GSPO 接口，以及 optional safety supplement 的具体测试要求。

这些条目保持 `Needs Review` 语义；本报告不会把 ID 对齐误报为 Spring 2026 中文题面已经逐题验证。
