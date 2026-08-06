# Contributing to PointBreaker

感谢你帮助 PointBreaker 增加课程或修正文档。提交内容应当可追溯、可验证，并保持课程原本的教学脉络。

## 新增课程

优先使用仓库内的 [`generate-course-site-pr`](skills/generate-course-site-pr/SKILL.md) Skill。正常的新课程 PR 只修改：

- 新的 `<slug>/` 课程目录
- `courses.json` 中的一条课程记录

不要复制其他课程的 vendor 资源；页面应使用根目录 `assets/course/` 与 `assets/vendor/` 的共享资源。

## 内容要求

- 以官方讲义、作业、Lab、代码和原始论文为主要来源。
- 不混用不同年份的课程材料，除非页面明确说明。
- 不猜测日期、教师、作业要求、实验结果或引用。
- 数学使用 `\(...\)` 与 `\[...\]`，代码标识符保持为完整 `<code>` 节点。
- 每篇讲义和实践导读包含一手资料列表与有解释的理解检查。
- 不提交无授权的课程 PDF、PPT、作业包、视频或 starter repository。
- 不访问或引用 `drive.google.com` 与 `docs.google.com`；使用已下载的本地副本。

## 验证

提交前至少完成：

```bash
git diff --check
python skills/generate-course-site-pr/scripts/refresh_status.py --repo . --slug <slug>
python skills/generate-course-site-pr/scripts/validate_course.py --repo . --slug <slug> --plan <plan> --inventory <inventory> --strict-resources
```

还需要在桌面与移动宽度检查主页课程卡、Dashboard、讲义、实践页面、公式、代码高亮、Quiz、前后导航与控制台错误。

## Pull request

PR 说明应包含课程身份、官方主页、资源覆盖、生成页面数量、缺失或有歧义的材料，以及验证结果。请勿直接推送或合并到 `main`。
