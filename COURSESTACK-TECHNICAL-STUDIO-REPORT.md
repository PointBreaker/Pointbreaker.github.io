# CourseStack Technical Studio · 全站设计重构报告

日期：2026-09-04

2026-09-05 复核：顶栏与总课程库继续向选定方案收敛；CS336 去除重复的课程内 TOC，CS168 将 trace inspector 固定到最右侧并补全 State / Table / Event 三种真实视图。

## 目标

本轮以已选定的“方案 2 · Technical Studio”为唯一视觉基准，把课程页面从居中的通用文档页升级为持续可用的学习工作台：

```text
Course map
→ Learning workspace
→ State / Table / Event inspector
```

这不是把十三门课程套进同一张卡片模板。共用的是信息架构、宽度、密度、导航与交互契约；课程的教学语言仍由课程类型决定。

## 覆盖范围

| 课程 | Dashboard | Lesson / Reading | Workbook / Project / Review | 右栏模型 | 状态 |
| --- | --- | --- | --- | --- | --- |
| MIT 18.01 | Technical Studio | 三栏阅读 | Problem Sets / Exams | Reasoning | PASS |
| MIT 18.02 | Technical Studio | 三栏阅读 | Problem Sets / Exams | Reasoning | PASS |
| MIT 18.06 | Technical Studio | 三栏阅读 | Problem Sets / Exams | Reasoning | PASS |
| MIT 6.102 | 双层来源工作台 | 三栏精读 | Engineering Workbooks | Engineering | PASS |
| MIT 6.1810 | Technical Studio | 三栏阅读 | xv6 Labs | Systems | PASS |
| MIT 6.5840 | Technical Studio | Field Notes 纳入共用外壳 | Labs / Assignments | Systems | PASS |
| Berkeley CS152 | Technical Studio | 三栏阅读 | Architecture Workbooks | Systems | PASS |
| Berkeley CS168 | Technical Studio | Packet-centric workspace | Discussions / Project Recaps | Systems | PASS |
| Berkeley CS170 | Technical Studio | 三栏阅读 | Reasoning Workbooks | Algorithm | PASS |
| Berkeley CS267 | Technical Studio | 三栏阅读 | Performance Workbooks | Systems | PASS |
| Stanford CS336 | Technical Studio | 三栏阅读 | Implementation Workbooks | Compute | PASS |
| Berkeley CS70 | Technical Studio | 三栏阅读 | Reasoning Workbooks | Theory | PASS |
| Michigan EECS498 | Technical Studio | 三栏阅读 | Review Labs | Compute | PASS |

## 方案 2 的结构落实

### 左栏 · 完整课程地图

- 桌面端固定显示完整课程结构，不再只显示当前页附近的少量条目。
- Lesson 左栏按课程语义分组，例如 CS168 使用“互联网地基 / 路由与转发 / 可靠传输 / 端到端服务 / 数据中心 / 无线与移动”。
- Dashboard 阶段不再只显示 `L1–L3`，同时展示该阶段第一项真实主题和讲义/实践数量。
- 当前页、课程进度、阶段边界均可见。

### 中栏 · 宽学习工作区

- 1536 px 视口下，左栏 222 px、右栏 316 px；中栏使用剩余宽度，消除旧版大面积无效留白。
- 标题、面包屑、模式标签和正文采用更紧凑的技术文档密度。
- 内容、交互实验、代码/推演入口保持在同一阅读上下文内。
- CS168 的 DV / Router / TCP 专用 trace 使用扩展工作区，让状态表和事件面板成为正文的一部分。

### 右栏 · 课程类型化 Inspector

- Networking / Systems：object or packet、local state、event or message、table or invariant。
- ML / AI：tensor or shape、representation、data flow、gradient or compute。
- Algorithms：input、state or iteration、invariant、complexity or counterexample。
- Software Construction：contract、representation、invariant、failure or evidence。
- Mathematics / Theory：definition、intuition、derivation、proof or counterexample。
- `State / Table / Event` 标签真实切换，不是装饰控件；同时提供本页证据计数、目录和 source / next action。
- CS168 的三个标签直接读取当前 trace frame：State 展示 before/after，Table 展示该轮路由表，Event 展示输入事件与时间线。
- CS336 不再同时显示课程自带 `ON THIS PAGE` 与共用 Table；正文主列扩展到约 930 px。

### 顶栏与总课程库

- 顶栏按方案 2 统一为 `CourseStack | 课程编号 · 课程全名 | 页面动作 | 用户入口`。
- CourseStack 总主页从旧的深色营销式首页调整为同一套 Technical Studio：左侧领域筛选、中央课程工作区、右侧 collection / authoring contract。
- 总主页筛选在桌面固定于左栏，在移动端变成横向可滚动筛选条。

## 内容层处理

- 保留现有 307 篇讲义、168 个实践项，不用通用占位文案覆盖课程正文。
- CS168 继续保留 26 课、9 个 Gold lesson、13 份 Discussion、225/225 小问级覆盖和 5 个交互组件。
- CS336、EECS498、6.1810、6.5840、CS152、CS267、数学与推理课程原有 depth gate 全部继续通过。
- 6.102 明确拆成 CourseStack 独立中文精读与 MIT 官方原文两个来源层；Dashboard 支持“双列 / 只看精读 / 只看原文”，不重新公开个人离线镜像。
- 首页阶段名称从序号提升为真实课程主题；右栏按课程类型补上正确的推理语言。修复了 CS336 被“机器学习系统”中的“系统”误判为 Systems Model 的问题。

## 交互与响应式验证

- Dashboard：视图过滤、搜索、课程状态 `State / Path / Source` 切换可用。
- Lesson：学习模式导航和右栏 `State / Table / Event` 切换可用。
- CS168 Network Trace：前后步骤会更新 frame、state、event 与 timeline。
- 6.102：来源层切换会正确隐藏/显示精读与官方原文入口。
- 13 门课程代表页在 1536 × 1024 下均无水平溢出。
- 13 门课程代表页在 500 × 900 下均无水平溢出；固定左右栏折叠，正文保持连续阅读。

## CI 修复

- 更新 6.102 内容 lint，使其验证新的原文/精读来源边界和真实官方 slug。
- 更新 CS168 内容 lint，使其识别新的 `network-trace` 数据契约，并验证 `before / event / after`、table 和 timeline 证据。
- 本地全站结果：`COURSE_CI_OK checks=14`。
