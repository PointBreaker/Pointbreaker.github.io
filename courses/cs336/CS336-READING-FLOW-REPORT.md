# CS336 Reading Flow Report

完成时间：2026-08-31（Asia/Shanghai）

本轮只整理阅读路径与信息架构，没有扩写课程知识主线。Spring 2026 现在是 Lecture 与 Assignment 的唯一 active narrative；版本历史仍可查，但不再要求学习者边读边辨认新旧内容。

## Lectures

- **Restructured page openings：**19 讲统一为 title / lede、轻量 source、核心问题、30-second mental model、Before you start；删去运行时重复生成的 learning outcomes 卡片。
- **Merged duplicate sections：**“这一讲到底解决什么问题”与紧邻 bridge 合并；question、mental model、prerequisite 收进一个无卡片堆叠的 opening flow。
- **Moved examples into the teaching flow：**原先位于首屏的 worked example 与 misconception 移到第一个机制 section 之后，避免先看到结论再遇到概念。
- **Simplified source metadata：**顶部只显示 `Source · Stanford CS336 Spring 2026 · Lecture N`；URL、材料边界与详细说明保留在可展开 provenance 中。Lecture 18–19 的多段来源说明合并为一个入口。
- **Improved transitions：**现有跨课连接统一为轻量 `Next`，不再表现成另一张大卡片。
- **Terminology pass：**补充显存 / GPU memory / HBM 的使用边界，并在首次出现时说明 FFN 与 MLP 的关系；后续课程沿用既有主术语。

## Assignments

- **Removed legacy blocks from the main flow：**active A1–A5 不再携带 118 道 Spring 2025 problem rows，也不再出现多层 legacy `<details>`。五个 active HTML 合计从约 612 KiB 降到约 17 KiB（不含共享 data-driven renderer）。
- **Unified current task path：**页面主入口是 `Task path / Problem guide / Official sources`；Stage 直接列出 Spring 2026 official IDs，并把完整要求指向当前官方 handout。
- **Compressed provenance：**顶部只显示课程、学期与当前 assignment version；checked date、source commit、basis、repository、README、PDF 与 changelog 收进 `Version & provenance`。
- **Compressed version history：**页底只保留 2–3 条 `Historical note · 2025 → 2026`，不再重复 authoritative problem map 或旧版完整任务。
- **Retained historical material：**五份旧中文导读与题面完整移入独立 `archive-2025-*.html`；archive 显示明确的非 active 标识、返回当前 Workbook 的链接与官方来源优先级。

## UX and regression safeguards

- Lecture 继续只生成一套 desktop sticky TOC；移动端使用同一数据生成可折叠目录。
- Assignment stage progress、Gate、Contract、sanity check、failure signatures 与 hints 的交互保持不变；课程 route 与既有 lesson progress 标识没有改名。
- `lint-cs336-content.mjs` 现在阻止 active Assignment 重新出现 legacy problem rows，并验证五份 archive、翻译数量、problem ID 映射、reading-flow renderer 与 source hierarchy。
- 详细逐页决策见 `CS336-READING-FLOW-AUDIT.md`；版本迁移事实仍记录在 `CS336-SPRING-2026-MIGRATION-REPORT.md`。

## Retained optional material

Lecture 的 Deep Dive 仅继续承载 CUDA implementation detail、硬件数字、可选推导与高级 edge cases。仍是后续课程 prerequisite 的 warp / block / SM、memory hierarchy、collective semantics、verifier / rollout 等主线内容没有被折叠或移出。

## Validation

- `node tools/lint-all-courses.mjs`：`COURSE_CI_OK checks=13`
- Site integrity：12 courses、499 HTML、8,556 local references 全部通过
- CS336 archive regression：A1–A5 共 118 道历史译题均被检测到，active Workbook 未重建旧题面
- Route smoke：19 Lectures、5 active Assignments、5 archives，共 29 个页面全部返回 HTTP 200
- JS syntax 与 `git diff --check`：通过
