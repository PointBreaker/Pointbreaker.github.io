# CourseStack 第二轮质量审查

审查日期：2026-09-05  
审查对象：平台主页、共享课程主页、课程正文、CS168 Discussion / Project、MIT 6.5840 首讲  
视口：1440×1000、500×1000，并补测 1200、1101、1050、768px

这份审查把当前版本当作外部团队交付的候选版本。截图来自本轮重新启动的本地静态站点，不复用旧 QA 截图。

## 证据截图

| 步骤 | 截图 | 健康度 |
| --- | --- | --- |
| 1 | [平台主页桌面](.course-build/second-pass-audit/01-platform-desktop.png) | 可用，但 hero 右侧空、学习方法首屏不可见 |
| 2 | [CS168 课程主页桌面](.course-build/second-pass-audit/02-cs168-home-desktop.png) | 可用，但课程合同与阶段主题不够突出 |
| 3 | [CS336 课程正文桌面](.course-build/second-pass-audit/03-cs336-lesson-desktop.png) | 可读，但导语被旧布局搬运过程丢失 |
| 4 | [CS168 Discussion 03 桌面](.course-build/second-pass-audit/04-cs168-discussion-desktop.png) | 内容完整，但错误答案反馈颜色冲突 |
| 5 | [CS168 Project 2 桌面](.course-build/second-pass-audit/05-cs168-project-desktop.png) | 内容扎实，目录缺少滚动定位反馈 |
| 6 | [MIT 6.102 课程主页](.course-build/second-pass-audit/06-6102-home-desktop.png) | 视觉成熟，但与共享课程主页的学习合同不一致 |
| 7 | [CS168 Discussion 03 移动端](.course-build/second-pass-audit/07-cs168-discussion-mobile.png) | 可读，但顶部没有课程上下文 |
| 8 | [CS336 正文移动端](.course-build/second-pass-audit/08-cs336-lesson-mobile.png) | 可用，但 intro 过薄、复制操作在触屏不可发现 |
| 9 | [CS168 Project 2 移动端](.course-build/second-pass-audit/09-cs168-project-mobile.png) | 可读，导航空间需要收紧 |
| 10 | [Discussion 错误反馈现场](.course-build/second-pass-audit/12-discussion-feedback-inview.png) | 暴露错误答案仍使用绿色成功背景 |
| 11 | [6.5840 正文首屏](.course-build/second-pass-audit/dist-lesson.png) | 空的 prerequisite 色块造成明显未完成感 |

## 具体问题与优先级

### P0

1. 6.5840 首讲的空 `prerequisite-block` 仍占据大块视觉空间，像未加载或未完成的组件。
2. Quiz 旧主题通过 `!important` 把错误选择染成绿色，反馈语义与视觉相反。
3. 无考试课程仍渲染“考试与复盘”标签；对应过滤器被隐藏后，点击没有效果。

### P1

4. 1101px 桌面实测固定目录右边界越过 viewport；需要提前降级为正文内目录。
5. 旧课程布局的 lede 没有进入新 reader intro，正文首屏只有标题。
6. 正文 breadcrumb 使用旧英文标题，中文阅读流被打断。
7. 新 reader 目录没有滚动中的 active section 状态。
8. 移动端隐藏课程上下文，同时保留“跳到页尾”，导航优先级倒置。
9. 代码复制按钮仅 hover 可见，触屏设备无法发现。
10. 课程主页阶段标题只显示讲次范围，主题名称只存在于被隐藏的 rail。
11. 平台主页 hero 右侧空白，平台的“学习 / 思考 / 实践”方法不在首屏。
12. 共享课程主页 hero 右侧空白，缺少轻量学习合同和可迁移能力提示。

### P2

13. 课程过滤后重新从 Course 01 编号，筛选结果失去稳定身份。
14. 课程卡没有显式进入动作，整个卡片可点但发现性不足。
15. 旧 dark/light token 和共享 reader 覆盖层并存，造成主题变量串色和后续维护风险。

## 审查边界

截图可以证明布局、层级、可发现性和反馈状态；不能单凭截图宣称完整无障碍合规。键盘焦点、屏幕阅读器顺序、浏览器剪贴板权限和外部 GitHub/Giscus 网络状态仍需要自动化与真实环境回归。

## 修复后的第二次验证

首轮问题没有以“脚本加载成功”结案，而是逐项回到 runtime DOM、computed style 与真实视口复查。当前证据：

| 复核项 | 结果 | 证据 |
| --- | --- | --- |
| 平台主页首屏有方法叙事与明确进入动作 | 已修复 | [平台主页桌面](.course-build/second-pass-audit/55-platform-final.png)、[平台主页移动端](.course-build/second-pass-audit/56-platform-mobile-final.png)（课程页共享同一 reader token；平台首屏布局由 `reader-home.css` 覆盖） |
| 所有共享课程主页使用同一“课程身份 → 合同 → 地图”结构 | 已修复 | [CS336](.course-build/second-pass-audit/46-cs336-final.png)、[6.5840](.course-build/second-pass-audit/47-65840-final.png)、[6.102](.course-build/second-pass-audit/48-6102-final.png)、[CS168](.course-build/second-pass-audit/49-cs168-final.png) |
| 正文目录在 1180px 以下内联降级，且滚动时有 active 状态 | 已修复 | [Discussion 03](.course-build/second-pass-audit/51-discussion-final.png)；WebDriver 在 1200/1101/1050/768px 检查无横向溢出 |
| 触屏复制、quiz selected/correct/incorrect、hint/reveal/completed 有可见反馈 | 已验证 | `qa-reader.mjs`：hints、reveal、quiz、notes、trace、completion、resume、search、clipboard 全通过 |
| 无考试课程不会暴露“考试与复盘”死控件 | 已修复 | runtime computed `display:none`：CS336、CS267、6.5840、CS70、CS170 等；`[hidden]` 已在 dashboard shell 中显式兜底 |
| 空 prerequisite / legacy source 不打断阅读流 | 已修复 | [6.5840](.course-build/second-pass-audit/47-65840-final.png)；正文保留紧凑的“来源与版本说明” |
| Project 2 归属审计表在正文列内完整换行 | 已修复 | [Project 2](.course-build/second-pass-audit/53-project-final-refined.png)；attribution table 使用固定列比例与 `overflow-wrap:anywhere` |
| 移动端正文、讨论、项目无 viewport 溢出 | 已验证 | [CS336 移动端](.course-build/second-pass-audit/52-cs336-mobile-final.png)；500px runtime 检查通过 |
| live branch 的公开页面实际加载新资源 | 已验证 | [公开 CS168 课程主页](.course-build/second-pass-audit/57-public-cs168-final.png)；HTML 与共享 CSS/JS 均返回 200，部署 workflow `33975857054` 成功 |

### 二次复盘结论

- 首轮列出的 3 个 P0、9 个 P1、3 个 P2 均已修复或验证；其中“无考试标签仍可见”是在修复后再次检查 computed style 时发现的实现缝隙，已补入共享 `[hidden]` 规则。
- 课程级 metadata、status JSON、标题与中文工作标签均重新解析；批量补充 `titleZh` 时曾出现 JSON 插入错误，已修复并对所有课程重新 `JSON.parse`。
- `node tools/qa-reader.mjs 23a0d1c5-db03-4210-b0ba-bdc92d6b5d5f` 输出 `READER_QA_OK pages=15 interactions=10`；`node tools/lint-all-courses.mjs`、`node tools/lint-site-integrity.mjs`、`node tools/check-code-block-formatting.mjs` 均通过。
- `tools/check-table-columns.py` 未运行成功，原因是环境缺少 `bs4`（`ModuleNotFoundError`）；没有把它记作通过，也没有因缺少依赖修改环境。

结论：当前实现已经从“首轮可用”推进到可交付候选，但无障碍完整合规、真实剪贴板权限、外部 GitHub/Giscus 网络状态仍不应仅凭截图或静态检查宣称完成。
