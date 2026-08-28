# MIT 6.1810 系统化教学重构报告

## 结论

本轮不是图示补丁。23 个 Lesson 已接入统一 Interactive Textbook 学习层，9 个 Lab 已接入 Engineering Workbook；原有中文正文、101 道课末题与完整 Lab 题面均保留。

## Lessons

| 项目 | 数量 / 行为 |
| --- | --- |
| Lesson | 23 |
| Before We Start | 每课 3 个先修回收问题 |
| 推导起点 | 每课 Objects / Toy Trace / Mechanism / Why not 4 部分 |
| Inline Concept Check | 每课 2 组 |
| Adaptive Follow-up | 答错自动展开；答对仅显示“再验证一次”入口 |
| Deep Quiz | 原有 3–5 道中文题重组 + 1 道跨 section 迁移题 |
| 闭卷解释 | 每课 2–3 题 |
| Explain checklist | 每课至少 5 项 |
| Lesson → Lab | 每课直接链接到对应 Workbook Stage |

页面使用单一 course-aware sticky TOC；共享运行时生成的 `.pb-toc` 被显式抑制，移动端折叠为顶部目录。

## Labs

| Lab | Stage | 主要能力 |
| --- | ---: | --- |
| util | 3 | 开发循环、用户程序、进程与管道 |
| syscall | 3 | trace、policy、adversarial sandbox |
| pgtbl | 3 | PTE、权限与超级页生命周期 |
| traps | 2 | ABI/backtrace、alarm context |
| cow | 3 | 共享映射、写 fault、引用计数闭环 |
| net | 3 | TX/RX ownership、证据型性能实验 |
| lock | 4 | baseline、per-CPU、bcache、evidence |
| fs | 3 | block map、symlink、持久化边界 |
| mmap | 4 | VMA、lazy fault、writeback、fork/exit |

共 28 个 Stage。每个 Stage 都包含：

- What You Are Building 与 Lesson section link
- 中文完整题面对应入口
- Input / Output / Invariants / Forbidden assumptions
- Correct / Understand / Evidence 三层 Definition of Done
- Tiny Sanity Check
- 至少 2 个 Failure Signatures
- Concept / Invariant / Debug Strategy 三级 Hint
- Hypothesis → Prediction → Controlled Experiment → Explanation
- 不硬锁页面的 Gate

原 Lab 题面没有折叠进 appendix；页面一级导航固定区分 `Engineering Workbook / 中文完整题面 / Official Lab`。

## 版本与技术准确性

- 官方课程标记为 MIT 6.1810 Fall 2026。
- Workbook 的官方链接指向 `https://pdos.csail.mit.edu/6.828/2026/labs/<lab>.html`。
- 2026 schedule 当前明确说明部分未来 lecture materials 是从旧版复制、会随课程推进更新。因此 CourseStack 不把本地中文正文冒充实时官方题面；任何接口、测试或交付要求冲突均以官方 2026 页面与 repository 为准。

## Regression

`tools/lint-mit61810-content.mjs` 自动验证：

- 23/23 Lesson 均有 practice data、2 个 adaptive checks、transfer、闭卷题与 Lab stage link；
- Concept Check 的 section target 实际存在；
- 9/9 Lab 均保留中文题面并加载 Workbook；
- 28 个 Stage 的 Contract、sanity、failures、hints、experiment loop 完整；
- Lab ↔ Lesson 和 Lesson ↔ Stage anchor 不断链；
- Lesson 与 Lab 均只显示一个 TOC。

## 仍需人工长期复核

- Fall 2026 课程推进期间发生的题面、branch、测试或 deadline 变化；
- 设备手册、QEMU 与 xv6 repository 的版本差异；
- 文件系统崩溃测试并未由网页静态教材替代；
- Meltdown、eBPF verifier/JIT 等硬件与实现相关结论应随架构和内核版本更新。
