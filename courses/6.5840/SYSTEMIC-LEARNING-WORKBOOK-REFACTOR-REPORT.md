# MIT 6.5840 系统级教材与 Engineering Workbook 重构报告

日期：2026-08-28
范围：21 个 Lesson、5 个 Lab、课程首页、学习与作业 lint

## 结论

本轮没有继续扩写已经足够深入的 321 个正文 section，也没有替换原有 Field Notes 视觉系统。改动集中在两条缺失的学习闭环：Lesson 从“精读 + 课末测验”升级为有即时认知校准的 Interactive Textbook；Lab 从“完整中文 Handout + 里程碑导读”升级为能指导实现、实验和证据收集的 Engineering Workbook。

既有资产全部保留：21 课正文、63 道原课末题、46 个中文 Handout 里程碑、94 份一手资料入口和 39 个 HTML 机制图。

## Lessons

### 统一增加

- 每课一个“本课真正解决什么问题”和四对象关系图。
- 每课 3 个 Before We Start prerequisite recall。
- 每课 2 个 section-level Concept Check，共 42 个。
- 每个 inline check 都带 misconception-specific follow-up：答错自动展开；答对只显示可选“再验证一次”。
- 原有每课 3 道题保留并重命名为“综合理解验证 · Deep Quiz”，共 63 道。
- 每课新增 1 道跨表面迁移题、2 道闭卷开放题和至少 5 项“你现在应该能够解释”。
- 每课增加到具体 Lab Stage 的 Learn → Build 链接。
- 保留既有 Field Index；课程级 CSS 禁止共享 `lesson-ui.js` 再显示第二个 `.pb-toc`。

### 节奏策略

- 普通正文保持教材排版，不把每段包成卡片。
- 只在对象图、Mental Model、Concept Check、误区修复和闭卷区使用特殊视觉语法。
- Follow-up 不制造连续考试感：错误时强制修正，正确时由学习者选择是否再验证。
- Source Vault 保持完整，但不干扰主线学习。

## Labs / Assignments

中文完整 Handout 仍是一级内容。Workbook 插在课程边界说明与完整题面之间；所有原里程碑只在运行时默认折叠一层，Stage 链接会自动展开并高亮目标题面。Official Handout 始终保留为最终权威来源。

| Lab | Stages / Gates / Contracts | Sanity checks | Failure signatures | Hint sets | Experiment loops | Lesson links | Stage-linked problems |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Lab 1 · MapReduce | 4 / 4 / 4 | 4 | 8 | 4 × 3 | 4 | 4 | 11 |
| Lab 2 · Key/Value Server | 4 / 4 / 4 | 4 | 8 | 4 × 3 | 4 | 5 | 8 |
| Lab 3 · Raft | 5 / 5 / 5 | 5 | 10 | 5 × 3 | 5 | 6 | 8 |
| Lab 4 · KV Raft | 5 / 5 / 5 | 5 | 10 | 5 × 3 | 5 | 6 | 5 |
| Lab 5 · Sharded KV | 6 / 6 / 6 | 6 | 12 | 6 × 3 | 6 | 6 | 7 |
| **合计** | **24 / 24 / 24** | **24** | **48** | **72 hints** | **24** | **27** | **39** |

其余 7 个里程碑属于 setup、环境、提交或通用 Handout 要求，仍列在“中文完整题面”的 Problem Index 中，没有被删除或降级。

### 每个 Stage 的结构

1. What You Are Building
2. Depends On（直接到 Lesson section anchor）
3. 对应中文题面（直接展开现有 problem row）
4. Contract：Input / Output / Invariants / Forbidden assumptions
5. Tiny Sanity Check
6. Failure Signatures
7. Hint 1 Concept / Hint 2 Invariant / Hint 3 Debug Strategy
8. Hypothesis → Prediction → Controlled Experiment → Observation / Explanation
9. Definition of Done：Correct / Understand / Evidence
10. Gate Check 与 assignment retrospective

## 双向信息架构

```text
Lesson section
  ↓ Learn → Build
Workbook Stage
  ↓ 对应中文题面
完整 Handout milestone
  ↓ coding / official tests
Official Spring 2026 source
```

- Lesson → Stage 链接全部由 lint 验证目标存在。
- Stage → 中文题面链接全部验证现有 DOM ID。
- 中文题面 → Stage 提供返回链接。
- Assignment 顶部只保留一组一级导航：Workbook / 中文完整题面 / Official Handout。
- 页面仍只有 CourseStack 自己的 Field/Build Index，不出现第二套 TOC。

## UX

### Desktop

- 沿用既有 210 / 760 / 190px Field Notes 三列阅读结构。
- Lab 沿用约 900px 主内容与横向 Build Index，不引入第三列。
- Stage Map 可横向浏览，Contract 和实验循环在两列中呈现。

### Mobile

- 对象图和 Stage Map 局部横向滚动，不产生页面级 overflow。
- Contract、实验循环、Definition of Done、Problem Index 自动变单列。
- 中文题目长标题允许自然换行。
- 高亮尊重 `prefers-reduced-motion`。

### 长页阅读

- 中文题面每题仅一层 `<details>`；没有 Deep Reference → Guide → Problem 的多层嵌套。
- Progressive Hints 默认折叠。
- Workbook 与题面由清晰一级锚点分段。

## 自动回归

新增 `tools/lint-mit65840-content.mjs`，验证：

- 恰有 21 个 Lesson、21 个 practice entry、5 个 Assignment、5 个 workbook entry。
- 42 个 inline check 的 target section 与 follow-up 都存在。
- 63 道既有 Deep Quiz 未丢失。
- 24 个 Stage 的 contract、sanity、failure、3-level hint、experiment 和 lesson anchor 完整。
- 46 个中文 Handout `.problem-row` 仍存在且保留“Handout 完整本土化”标记。
- Lesson → Stage、Stage → translated problem、Assignment → Lesson 三类链接无断点。
- Spring 2026 版本声明存在。
- Course CSS 显式抑制共享第二 TOC。

运行：

```bash
node tools/lint-mit65840-content.mjs
```

## 仍需人工持续复核

- Spring 2026 官方 repository 后续可能更新接口、tests 或 Handout 文案；官方 source 永远优先。
- Raft、KV Raft 与 Sharded KV 的具体实现行为需随课程骨架版本复核，Workbook 只描述 contract 与调试方向，不提供 solution。
- 性能实验结果依赖本机、Go 版本、网络模拟配置、seed、warm-up 和重复次数；页面没有给出无条件倍数。
- 官方课表标注的未来 notes/questions 可能沿用旧年材料并在授课前更新，需要在学期中继续核验。
