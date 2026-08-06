# CourseStack · 课栈

CourseStack（课栈）是一个面向系统与机器学习课程的开放中文学习档案。课程主页、Dashboard、讲义、作业和实验共享同一套数据模型与阅读设计，可持续扩展到更多课程。

## 浏览课程

打开 [CourseStack 课栈课程主页](https://pointbreaker.github.io/)；课程目录由 [`courses.json`](courses.json) 自动生成，支持搜索和主题筛选。

## 用 Skill 新增课程

仓库内置 [`generate-course-site-pr`](skills/generate-course-site-pr/SKILL.md) Skill。它会从本地课程资源生成 CourseStack v2 课程，完成校验后向本仓库提交 PR。

### 安装

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R skills/generate-course-site-pr "${CODEX_HOME:-$HOME/.codex}/skills/"
```

也可以下载发布页中的 ZIP，解压后把其中的 `generate-course-site-pr` 文件夹复制到 Codex skills 目录。

安装一次即可。Skill 每次启动课程生成流程时，都会先从本仓库 `main` 分支检查最新版；更新包会经过文件大小与 SHA-256 校验，完整下载成功后才替换本地版本。离线时会继续使用已安装版本，本地手工修改过的文件不会被自动覆盖。若要关闭自动更新，可设置 `COURSESTACK_SKILL_AUTO_UPDATE=0`。

### 使用

1. 把官方讲义、PDF、PPT/PPTX、作业、Lab、代码和笔记放在同一资源文件夹。
2. 在该文件夹中启动 Codex。
3. 提供官方课程主页，并调用：

```text
Use $generate-course-site-pr to turn this folder into a new CourseStack course and open a PR.
```

Skill 会盘点资源、建立课程计划、生成前端与内容、检查公式和页面、创建分支并打开 PR。它不会访问 `drive.google.com` 或 `docs.google.com`，请提前下载需要的官方资料。

所有讲义、作业与 Lab 页面会通过共享阅读层自动接入 GitHub Discussions 评论。评论由 Giscus 承载，页面路径作为独立话题标识；新课程无需复制评论代码。

仓库管理员首次启用评论时，需要安装 [Giscus GitHub App](https://github.com/apps/giscus/installations/new) 并授权本仓库，然后将 `site-comments.json` 中的 `installed` 改为 `true`；Discussions 与页面配置已经纳入平台。

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
<course>/course-info.json       课程元数据
<course>/api/status.json        讲义与实践状态
<course>/lessons/               课程正文
skills/generate-course-site-pr  可分发课程生成 Skill
```

## 贡献

课程 PR、内容修订和平台改进请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。新课程通常只应新增课程目录并向 `courses.json` 添加一条记录。
