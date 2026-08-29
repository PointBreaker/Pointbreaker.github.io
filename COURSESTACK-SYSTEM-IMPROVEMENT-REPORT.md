# CourseStack 全课程系统改进收口报告

更新日期：2026-08-29

## 结论

本轮长任务已按风险与学习价值从高到低完成。CourseStack 当前目录由 12 门课程、281 讲、151 个作业、实验或 Workbook 构成。改进没有用统一模板覆盖学科差异，而是建立了四类不同学习动作：

- 系统课：状态、消息、资源与故障 trace。
- 工程课：contract、tiny sanity check、failure signature、prediction/evidence 与 Gate。
- 数学课：表示选择、视觉推导、先预测与闭卷迁移。
- 证明/算法课：proof obligation、counterexample、invariant、correctness 与 complexity audit。

所有阶段均单独提交、推送，并在 GitHub Pages 发布成功后才进入下一阶段。

## 已发布阶段

| 阶段 | 发布提交 | 实际完成内容 |
| --- | --- | --- |
| MIT 6.5840 Lab 桥接 | f78ec78 | 修复 13 讲中的 21 个错误 Lesson→Lab 路径；lint 开始验证目标文件存在。 |
| MIT 6.102 发布治理 | 160d1c6 | 移除不允许再发布的 570 文件、32 MB 原始镜像；保留 19 讲独立中文教材与 5 份 clean-room Workbook；增加 source notice 与禁止回归检查。 |
| 全站完整性 CI | 9091ac7 | 新增 catalog、链接、anchor、重复 ID、重复 TOC、图片 alt、外链安全与 feedback 可访问性检查，并接入 GitHub Actions。 |
| Catalog 单一数据源 | 96f005e | 以各课程 api/status.json 为 inventory source，生成首页静态课程卡与统计；无 JavaScript 时仍可浏览 12 门课程。 |
| EECS498 Review Labs | 47a3b65 | 新增 6 个 code review labs、23 个工程阶段；覆盖 tensor、autograd、CNN、attention、RNN、detection 等代码阅读与证据验证。 |
| CS152 Architecture Workbooks | 387f37c | 26 讲新增体系结构 mental model、真实 HTML 流程/状态图与主动检查；11 份导读新增 33 个逐周期、逐地址、逐状态 Workbook 阶段。 |
| MIT 数学视觉推导 | 4538fc3 | 18.01、18.02、18.06 共 108 讲新增 108 个语义推导图、108 个预测题、108 个闭卷迁移题；保留 18.06 原有 4 个交互。 |
| CS70 / CS170 Reasoning Workbooks | 3a1ed11 | 68 份 Discussion/Homework 新增证明、概率或算法专属 Workbook；24 讲新增不进入 TOC 的练习桥；保留 13 个原有交互。 |
| 最终收口 | 本报告所在提交 | 扩充 HTML 基线 lint，执行全站最终回归并记录已知边界。 |

## 当前自动化验收

node tools/lint-all-courses.mjs 是统一入口，当前包含 13 组检查：

1. Catalog 与 course manifests 同步。
2. 全站 HTML、链接、anchor、资源、目录与基础可访问性。
3. Code block markup。
4. 语义化 framework diagrams。
5. CS336 教材、Workbook 与中文题面回归。
6. CS267 教材与 Workbook。
7. CS152 architecture reasoning 与 Workbook。
8. MIT 18.01 / 18.02 / 18.06 visual reasoning。
9. CS70 / CS170 discipline reasoning Workbook。
10. MIT 6.102 authored-only 发布边界。
11. MIT 6.1810 教材与 labs。
12. MIT 6.5840 教材、labs 与中文题面。
13. EECS498 教学深度与 Review Lab 数据契约。

全站完整性检查覆盖 494 个 HTML 页面及 8,000+ 个本地引用，并检查：

- HTML5 doctype、lang、非空 title 与 viewport。
- 本地 href/src 目标与 fragment anchor。
- 重复 ID 和同页重复静态 TOC。
- 图片 alt。
- target="_blank" 的 noopener/noreferrer。
- Quiz / feedback 的 role=status 与 aria-live。

## 课程层面的当前状态

| 课程 | 本轮后的关键学习体验 |
| --- | --- |
| CS336 | Interactive Textbook + 5 份 Engineering Workbook + 一级中文完整题面 + official source 分层。 |
| CS267 | 27 讲系统级推演、真实 HTML framework diagrams、7 个 Workbook。 |
| MIT 6.1810 | 23 讲操作系统教材、9 个 labs、28 个 Workbook stages。 |
| MIT 6.5840 | 21 讲分布式系统教材、5 个 labs、24 个 Workbook stages、46 个中文 handout rows。 |
| MIT 6.102 | 19 讲独立教材 + 5 个 clean-room Workbook；不再发布受限原站镜像。 |
| EECS498 | 14 讲代码事实驱动教材 + 6 个 Review Labs / 23 stages。 |
| CS152 | 26 讲体系结构推演 + 11 个 Architecture Workbooks / 33 stages。 |
| MIT 18.01 / 18.02 / 18.06 | 108 讲统一视觉语法，但按微积分、多元几何、线性映射分别训练不同数学动作。 |
| CS70 | 41 个 Proof & Probability Workbooks；从量词、反例、样本空间到矩与连续分布。 |
| CS170 | 27 个 Algorithm Workbooks；从 contract、invariant 到 DP、LP 与 NP reduction。 |

## 明确保留的边界

- 6.102 self-study 中的 TODO 是故意留给学生的 clean-room skeleton，不代表页面未完成。
- 课程 dashboard 与 EECS498 Review Lab 的主标题由数据驱动 renderer 生成；静态 wrapper 本身保持极薄。
- CS70 / CS170 的官方参考答案仍作为原有折叠题面资源保留；Workbook 不复制答案，也不把“展开过答案”视为 Gate 通过。
- 所有新图均为可访问的 HTML 结构，不使用 ASCII 伪图；复杂度受控，没有新增重型 simulator 或 tutor engine。

## 仍需人工周期性复核

自动检查可以阻止结构回归，但不能替代以下人工工作：

- Stanford / MIT / Berkeley 官方课程版本、题号和 handout 更新。
- H100、FSDP、FlashAttention、推理性能等硬件或实现相关数字的 benchmark 条件。
- scaling-law、RL/alignment 等经验性结论的论文版本与适用范围。
- 不同浏览器、字体、缩放比例和真实移动设备上的长页视觉 QA。
- 每门课程少量代表课的专家级技术准确性复读，以及学生真实使用后的误区反馈。

## 发布验收标准

每次后续修改至少应执行：

    node tools/lint-all-courses.mjs
    git diff --check

涉及 catalog 时还需执行：

    node tools/sync-course-catalog.mjs
    node tools/sync-course-catalog.mjs --check

发布后应等待并确认 GitHub 的 Course integrity 与 pages build and deployment 两个 workflow 都成功，再抽查一个受影响的线上页面与其数据资源。
