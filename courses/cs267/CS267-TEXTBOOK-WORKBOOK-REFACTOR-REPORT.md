# CS267 Interactive Textbook + Engineering Workbook 重构报告

日期：2026-08-27  
课程版本：UC Berkeley CS267 Spring 2025

## 结论

本轮没有把 27 节既有中文正文继续无边界扩写，而是在保留 CourseStack 阅读风格和原内容的前提下，补齐了统一的学习闭环：

```text
Lesson: 问题 → 先修回收 → mental model → Concept Check → 误区诊断 → Deep Quiz → 闭卷解释

Assignment: Stage → Contract → Tiny sanity check → Debug → Prediction/Experiment → Evidence → Gate
```

## Lessons 01–26（含 06b、25b）

| 项目 | 数量 / 结果 |
| --- | ---: |
| Lesson 页面 | 27 |
| 30 秒知识地图 | 27 |
| Before We Start | 54 prompts |
| Inline Concept Check | 27 |
| Adaptive Follow-up | 27；答错自动展开，答对仅显示可选入口 |
| Deep Quiz | 54 |
| 闭卷开放题 | 54 |
| “不看上文，你能解释吗？” | 108 项 |
| Sticky lesson TOC | 27；桌面右栏、移动端折叠 |
| Lesson → Assignment / Project bridge | 27 |

### 教学重构重点

- 用 `FLOPs → bytes → arithmetic intensity → roof`、`owner → message → completion`、`frontier → irregular work → load balance` 等对象关系代替术语堆叠。
- 每课至少一个真实 misconception 驱动的局部题；错误解释指出混淆的对象，随后给同机制变体题。
- 原有五道快速题保留但折叠为“快速复习”，不再阻断正文节奏。
- Deep Quiz 不强制完成；开放题统一为闭卷解释，保持教材感而非游戏化。
- 结论类型显式提醒 `Exact / Approximation / Asymptotic / Hardware-specific`。

### 技术准确性修复

- Lesson 03 将 ridge point 改为两条 Roofline 上界的分界，不再称为“最佳效率”。
- 删除脱离精度、内存层级与具体硬件的“典型 GPU Machine Balance 5–10”普适表述。
- 修复 TRIAD 循环条件 `i < N`。
- 将 stencil 的 1 read + 1 write 标为理想 cache 复用下的 napkin-math approximation，并补充 write allocate、边界与容量条件。
- 修复 Lesson 03 嵌套 `<article>` 与 Lesson 24 suffix-array code block 的 HTML 结构错误；后者原先会把余下题目吞进 `<code>`。
- 旧 Quiz runtime 现在兼容 `data-answer`、按钮答案与 `data-correct="a–d"` 三种历史格式。

## Homework 1–4 + Project

所有页面保留原有中文导读、优化路线、cheatsheet、报告要求与自测，不把它们降级成 appendix。页面新增三个同级入口：

1. Engineering Workbook
2. 中文完整任务说明
3. Official Sources

| Work item | Stages | Gates | Contracts | Tiny checks | Failure signatures | Hint sets | Experiment loops | Lesson links |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| HW1 · Matrix multiplication | 4 | 4 | 4 | 4 | 12 | 4 × 3 | 4 | 5 |
| HW2-1 · OpenMP particles | 4 | 4 | 4 | 4 | 12 | 4 × 3 | 4 | 4 |
| HW2-2 · MPI particles | 4 | 4 | 4 | 4 | 12 | 4 × 3 | 4 | 4 |
| HW2-3 · CUDA particles | 4 | 4 | 4 | 4 | 12 | 4 × 3 | 4 | 5 |
| HW3 · UPC++ genome | 4 | 4 | 4 | 4 | 12 | 4 × 3 | 4 | 5 |
| HW4 · distributed PCG | 4 | 4 | 4 | 4 | 12 | 4 × 3 | 4 | 5 |
| Final Project | 4 | 4 | 4 | 4 | 12 | 4 × 3 | 4 | 5 |
| **Total** | **28** | **28** | **28** | **28** | **84** | **84 hints** | **28** | **33** |

### Assignment 信息架构

- Stage 顶栏可横向浏览，桌面保留一条 220px sticky stage map，不增加第三栏。
- 每个 Stage 都有 What You Are Building、Depends On、Contract、Definition of Done、Tiny sanity check、Failure Signatures、三级折叠 Hint、实验循环与 Gate。
- 中文任务映射是一级 section；Stage 可跳转到 `#problem-<stage-id>`，目标自动展开，并可返回 Workbook Stage。
- Official handout 与 starter repository 在顶部和末尾均可见；Spring 2025 是唯一标注版本，冲突时官方来源优先。
- Gate checkbox 只做克制的本地能力记录，无 XP、streak、排名或硬锁。
- 每份作业末尾增加 Retrospective，要求解释原 mental model、失败实验和资源交换。

## UX / Responsive

- Lesson：主内容约 820px + 右侧 200–230px TOC；移动端单栏并折叠目录。
- Assignment：主内容约 850px + 右侧 220px stage map；移动端隐藏侧栏，一级资源导航与 stage strip 局部横向滚动。
- 所有 27 Lesson 与 7 work item 在 Firefox WebDriver 的 1280px 桌面回归中无页面级横向溢出。
- HW1 在 500px 移动视口无页面级横向溢出；表格、导航和 stage strip 只在组件内部滚动。
- 保留暖色纸张、serif 标题、深色导航和低饱和绿色强调；特殊内容依赖 label、边框和排版，而不是彩色卡片墙。

## Regression / QA

- 新增 `tools/lint-cs267-content.mjs`：检查 27 个 lesson bank 条目、adaptive follow-up、Deep Quiz、开放题、技术禁用短语、27/7 资源加载、28 stages 的 Contract/DoD/Failure/Hint/Experiment/lesson links 与官方版本。
- 专用 lint：passed。
- JavaScript syntax：passed。
- CourseStack code-block formatting：passed。
- `git diff --check`：passed。
- 浏览器全量 smoke：27 / 27 Lessons、7 / 7 work items passed。
- 交互实测：答错自动显示 required follow-up；答对只显示可选“再验证一次”；Stage → 中文任务会自动展开。

通用 `validate_course.py` 仍会报告 CS267 历史页面的旧 Quiz DOM、未标 `language-*` 的静态 code block，以及 status 中 `6b / 25b / 2-1` 等非整数课程编号。它与 CS267 的既有编号和多代页面格式不兼容；本轮没有为了让通用校验器变绿而改写官方课程编号或删除旧内容，新增的 CS267 专用 lint 覆盖本轮所有结构性回归。

## 仍需人工复核的事实

- Berkeley 官方页面或 repository 后续若修改 starter interface、提交命令、deadline，应以官方来源同步。
- HW1 的 Perlmutter 峰值口径依赖官方 2025 指定 CPU、boost、vector width、FMA 与 pipeline 假设。
- CUDA 性能结论必须绑定 GPU、driver、precision、shape、warmup、synchronization 与 repetitions。
- UPC++ completion / progress 行为、MPI implementation 与机器网络会影响实测。
- PCG 收敛与预处理收益依赖矩阵谱、容差和 stopping criterion。
- Project 中所有 empirical claim 都需要学生按自己的硬件、数据和 baseline 重新验证。

