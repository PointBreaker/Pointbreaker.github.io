# 中文教材界面 · 设计 QA

参考图：`/home/dax/Documents/project.png`（1448 × 1086，四屏概念板）。实现目标是中文优先、安静克制、适合长期阅读的技术教材，而不是 dashboard 或营销页。

## 覆盖范围

- 13 个课程主页：共享课程使用 `reader-dashboard.css` + `dashboard.js`，MIT 6.102 使用 `reader-mit.css`，CS168 使用专属 portal；三者共享同一套中文 token、阅读入口和学习记录。
- 528 个课程 HTML 内容页已接入 `reader.css` + `reader.js`（含 6.102 自学页、CS267 project 页与 18.06 的特殊 work-item 页）；13 个课程主页分别使用共享 dashboard 或等价的专属 portal 适配器。
- 代表性截图：`.course-build/reader-qa/{home,course,lecture,discussion,project}-{1440,768,500}.png`、`6102-resume.png`、`6102lecture.png`、`267projects2.png`、`eecshome2.png`、`project-code.png`。

## 视觉与阅读检查

1. **信息架构**：平台首页 → 课程主页 → 内容页 → Discussion / Project 的路径清楚；内容页正文为主，桌面端右侧仅保留轻量目录与注释，移动端自动折叠。
2. **版式**：最大 1260px 内容框架，正文段落最大约 790px，表格和代码允许宽展；正文不再被旧 inspector 或重复 TOC 挤窄。
3. **组件**：心智模型、为什么、不变量、误区、失败、历史说明、来源、代码 header、提示 / 解析 / 变式统一 spacing、边框和标题语义。
4. **中文化**：平台导航、课程入口、继续学习、学习 / 思考 / 实践、练习标题、提示、解析、复制代码和空状态均以中文为主；协议、API、公式和源码标识符保留必要英文。
5. **课程差异**：CS168 保留 packet-centric 课程轨道；CS336 / EECS498 的 trace 与表示流采用浅色纸面图；6.102 保留原始 MIT 课程身份与 source boundary，不被误标成 CS168。
6. **代码与数学**：代码块提供语言标识和复制按钮；KaTeX / 原有公式保持正文渲染，右侧不重复公式。

## 功能检查

Firefox WebDriver 实测通过：提示、解析、quiz、trace、表格面板、完成标记、复制代码、草稿刷新持久化、课程 / 平台续读、课程搜索空状态和移动端目录折叠。6.5840 异步增强页面另验证了 reader aside 会在延迟插入课程 intro 后保持挂载，并收录 late-added headings。

机器检查通过：`node tools/qa-reader.mjs`（15 个页面、10 项交互）与 `node tools/lint-all-courses.mjs`（13 门课程、307 lectures、168 work items、站点完整性检查）。

未执行实体手机与跨浏览器矩阵，也未声称没有任何第三方控制台消息；学科事实仍以各课程官方 source 为准。

后续可扩展：将更多课程专属旧 CSS 逐步迁移到共享 token，并为需要的课程补充专门的 state / table / tensor 练习模板。

final result: passed
