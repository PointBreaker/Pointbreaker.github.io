# Course Authoring Skill · 2026-09-02 稳定化记录

## 为什么要改

旧版 `skills/generate-course-site-pr` 已经能完成来源发现、CourseStack v3 页面、Assignment Workbook、交互组件、reading-flow 与发布 QA，但主流程仍允许 agent 先铺完整门课程再回头补深度。它的 lesson contract 虽然鼓励推导、反例和练习，自动校验却只要求“一课至少一道 quiz”。这造成几类稳定复现的失败：页面与链接齐全，但核心机制停在定义；例子只走一步；quiz 偏记忆；系统课没有 packet/state/table timeline；公式在 HTML 里存在却未真正渲染；历史材料以大块 supplement 打断主线。

## 新的生产顺序

工作流现在强制为：

```text
Source Audit
→ Course Type Detection
→ Concept Dependency Graph + Learning Objectives
→ Course Map + Depth Ledger
→ 2–4 Gold Standard Lessons（用户明确指定时可更多）
→ Human-quality Self-review
→ Scale the Approved Pattern
→ Depth QA
→ Reading-flow QA
→ Render QA
→ Reverse Validation
```

Gold slice 未通过前不得批量扩写。无法从 source 回答机制对象、状态、事件、输出和不变量时，状态是 `DO_NOT_WRITE_YET` 或 `BLOCKED_BY_SOURCE`，不能用概述填空。

## 新增 Course Type Profiles

- **ML / AI**：tensor、shape、representation、data flow、parameter、activation、gradient、compute。
- **Networking / Distributed Systems**：packet、state、table、event、message、timeline、invariant、failure；默认转移式为 `packet/message + local state/table + event → new state + output`。
- **Algorithms**：input、state、iteration、invariant、complexity、counterexample。
- **Theory**：definition、intuition、lemma、derivation、proof、counterexample。
- 混合课程必须指定一个 primary profile；secondary profile 只用于确有必要的章节。

详见 `references/course-type-profiles.md`。

## 新增质量 Gates

### Mechanism Gate

每个核心概念写作前必须回答：为什么有问题、最简单方案为何不足、处理什么对象、保存什么 state、输入 event、内部 transition、output、invariant、移除机制后的 failure。回答不了就继续查 source。

### Worked Trace / Counterfactual / Misconception Gate

- trace 必须有 initial state 与逐步 before/event/after/output，不能从例子直接跳结论；
- 主要 lesson 至少提出一个设计反事实并推到可观察 failure；
- misconception 必须包括“为何诱人 → 具体反例 → 正确 mental model”。

### Exercise / Question Quality Gate

练习改为按深度分布：轻量 prerequisite probes、机制旁 inline checks、跨节 deep checks、closed-book Explain It Yourself。数字是校准范围而非模板配额，但核心课只有一道记忆题一律 `INSUFFICIENT`。题目优先测 direction、state、causality、invariant、shape、sequence、failure、counterfactual、transfer，错误选项映射真实误解。

### Depth Gate

完成前必须判断学习者能否闭卷解释 why、手推例子、预测 failure、说出保存的 state，并把实现条件连接到 invariant。状态词固定为 `GOLD / GOOD / SHALLOW / BLOCKED_BY_SOURCE`。

### Reading-flow / Version Gate

主路径优先 prose、diagram、table、code、trace；卡片只服务 Mental Model、Misconception、Warning、Historical Note。active curriculum 只能有一个；仍有效旧内容自然合并，历史价值压成短 note，obsolete 内容移入 archive/report，不再出现大型 Legacy Supplement。

### Render Gate

新增 source 与浏览器双层检查：控制字符、数学分隔符、KaTeX runtime error、code block、互动 fallback、链接/nav、quiz 路径、SVG、键盘、移动横向溢出。发现一种数学缺陷时必须扫描整门课程的同类缺陷，不能只修截图中的一处。

## 可执行校验变化

- 新增 `scripts/audit_lesson_depth.py`：读取 `courseTypeProfiles`、`qualityContract.goldLessons`、页面状态、quiz 数与语义 evidence；声明为 Gold 却缺 trace/counterfactual/misconception/deep checks/explanation/implementation mapping 时失败。
- `validate_course.py` 新增 math-render cache version、不可见控制字符、数学分隔符外 LaTeX command 检查。
- `scaffold_course.py` 为 `math-render.js` 加共享 cache version。
- `course-plan.json` contract 新增 course profile 与 Gold declarations。
- depth auditor 明确只证明“结构证据存在”，不能把 class 数量当成人工教学质量评分。

## CS168 反向验证

新流程首先在 CS168 找到了三类旧 validator 漏检：五个核心课都只有一道 quiz；L11 的 `SND.UNA` 与 RTO 公式含转义损坏；交互 stepper 只有四句高层概述，未显示完整状态。Gold slice 修复后再扩到其他课，证明 profile 能产生 routing table、TCP state、application timeline、datacenter traffic、wireless channel 等不同原语，而不是统一 HTML 模板。

反向验证也暴露了新规则需要保留人工判断：语义 class 和题目数量可以回归检测，却不能证明推导正确或 reading flow 连贯。因此 `GOLD` 仍强制浏览器检查与 human-quality self-review，自动脚本不得自行授予。

反向跑 CS168 时还发现 contract 与 scaffolder 之间的一处真实缝隙：最初虽然要求 plan 声明 profile/Gold lessons，scaffolder 却没有把它们写进 `course-info.json` 或页面 `<body>`。现已补上 plan 校验、metadata 透传，以及新页面默认 `SHALLOW` 的诚实状态，避免新 validator 只对手工修过的课程有效。
