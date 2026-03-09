# AGENTS.md - Pointbreaker.github.io 项目说明

> OpenClaw 会读取此文件来了解和管理这个 GitHub Pages 项目。

---

## 📋 项目信息

| 属性 | 值 |
|------|-----|
| **项目名称** | dax's Page (个人简历主页) |
| **GitHub** | https://github.com/PointBreaker/Pointbreaker.github.io |
| **访问地址** | https://pointbreaker.github.io/ |
| **技术栈** | Vue 3 + Vite 5 |
| **本地克隆** | `/tmp/Pointbreaker.github.io/` |
| **最后更新** | 2026-03-10 |

---

## 📄 页面内容

### 简历主页 (当前)
- **姓名：** dax
- **职位：** AI开发工程师
- **学历：** 硕士 深圳大学 / 本科 南昌大学
- **经历：** 腾讯 (2025.08-至今) / 深信服 (2024.07-2025.08)
- **技能：** Python / Java / C C++ / AI (CV+NLP) / 网络安全 (Pwn+Web)

### 页面结构
- Education - 学历信息
- Skills - 技能进度条
- Experience - 工作经历时间线

---

## 🚀 部署配置

### GitHub Pages 设置
- **Source：** GitHub Actions（⚠️ 不是 "Deploy from a branch"）
- **Workflow：** `.github/workflows/deploy.yml`
- **触发：** Push to main / 手动触发

### 构建流程
```
Push → GitHub Actions 
     → npm install
     → npm run build
     → 上传 dist/ 
     → 部署到 Pages
```

---

## 📁 项目结构

```
Pointbreaker.github.io/
├── index.html           # HTML 入口
├── package.json         # 依赖配置
├── vite.config.js       # Vite 配置
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml   # CI/CD
└── src/
    ├── main.js          # Vue 入口
    └── App.vue          # 主组件
```

---

## ⚙️ 关键配置

### vite.config.js
```js
base: './'  // 相对路径，支持子目录部署
```

### deploy.yml
- Node.js 20
- `npm install`（不用 npm ci）
- 构建输出：`dist/`

---

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

---

## 📝 修改流程

```bash
cd /tmp/Pointbreaker.github.io
# 修改 src/App.vue 或其他文件
git add .
git commit -m "✨ Update description"
git push
# GitHub Actions 自动部署
```

---

## ⚠️ 常见问题

| 问题 | 解决方案 |
|------|---------|
| 空白页面 | Settings → Pages → Source 改为 **GitHub Actions** |
| Assets 404 | 检查 `vite.config.js` 的 `base: './'` |
| 构建失败 | 检查 Actions 日志，确认 npm install 成功 |

---

## 🔗 相关资源

- **Skills 仓库：** https://github.com/PointBreaker/skills
- **部署 Skill：** `github-pages` skill
- **Workspace 记忆：** `/home/dax/.openclaw/workspace/MEMORY.md`
