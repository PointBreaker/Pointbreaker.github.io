# CourseStack · 课栈

CourseStack（课栈）是一个面向系统与机器学习课程的开放中文学习档案。课程主页、Dashboard、讲义、作业和实验共享同一套数据模型与阅读设计，可持续扩展到更多课程。

## 浏览课程

打开 [CourseStack 课栈课程主页](https://pointbreaker.github.io/)；课程目录由 [`courses.json`](courses.json) 自动生成，支持搜索和主题筛选。

## 用 Skill 新增课程

仓库内置 [`generate-course-site-pr`](skills/generate-course-site-pr/SKILL.md) Skill。只需提供官方课程链接，它会发现当前学期的一手资料、判断是新建还是迁移现有课程，并把课程重构为 CourseStack v3 的中文自学教材与 Engineering Workbooks；本地资料是可选补充。

### 安装

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R skills/generate-course-site-pr "${CODEX_HOME:-$HOME/.codex}/skills/"
```

也可以下载发布页中的 ZIP，解压后把其中的 `generate-course-site-pr` 文件夹复制到 Codex skills 目录。

安装一次即可。Skill 每次启动课程生成流程时，都会先从本仓库 `main` 分支检查最新版；更新包会经过文件大小与 SHA-256 校验，完整下载成功后才替换本地版本。离线时会继续使用已安装版本，本地手工修改过的文件不会被自动覆盖。若要关闭自动更新，可设置 `COURSESTACK_SKILL_AUTO_UPDATE=0`。

### 使用

1. 在 CourseStack repository 中启动 Codex。
2. 提供官方课程主页，并调用：

```text
Use $generate-course-site-pr on https://example.edu/course/ and open a PR.
```

Skill 会从官方页面建立当前学期 source map，沿一手链接发现公开 slides、handouts、repositories 与 changelogs，完成版本/教学深度审计，再生成或迁移课程、修复阅读流、检查公式与页面并打开 PR。公开资料的工作副本只放在 `.course-build/`，不会随网站提交。本地已有 PDF、PPT/PPTX、作业、Lab、代码或笔记时，也可以一并提供；仓库策略不允许访问的云端资源会记录为 coverage gap。

CourseStack Interactive v1 支持参数化函数图、矩阵热力图和分步推导。所有交互使用仓库内的共享运行时，不依赖外部 CDN，并强制保留静态降级图。

所有讲义、作业与 Lab 页面会通过共享阅读层自动接入 GitHub Discussions 评论。点击顶部“讨论”会打开右侧抽屉；桌面端会为抽屉让出空间，不遮挡正文。评论由 Giscus 承载，页面路径作为独立话题标识；新课程无需复制评论代码。

本仓库已经安装并启用 Giscus。其他部署首次启用评论时，需要安装 [Giscus GitHub App](https://github.com/apps/giscus/installations/new)、授权目标仓库，并将 `site-comments.json` 中的 `installed` 改为 `true`。

完整说明见 [课程生成指南](docs/course-generator.html)。

## 本地预览

```bash
python3 -m http.server 4173
```

然后打开 `http://127.0.0.1:4173/`。

## 站点结构

```text
assets/                         共享主页、Dashboard、阅读页与 vendor 资源
courses.json                    数据驱动课程目录
site-platform.json              平台版本与共享资源契约
site-comments.json              GitHub Discussions / Giscus 评论配置
courses/<course>/course-info.json  课程元数据
courses/<course>/api/status.json   讲义与实践状态
courses/<course>/lessons/          课程正文
courses/<course>/figures/          静态图与交互降级图
courses/<course>/interactives/     声明式交互 JSON
skills/generate-course-site-pr  可分发课程生成 Skill
```

## 贡献

课程 PR、内容修订和平台改进请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。新课程通常只应新增 `courses/<slug>/` 并向 `courses.json` 添加一条记录。
