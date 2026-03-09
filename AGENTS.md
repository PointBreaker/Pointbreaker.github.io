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
    ├── main.js          # Vue 入口 + Router 挂载
    ├── App.vue          # 根组件（全局样式）
    ├── router.js        # 路由配置
    └── views/
        ├── Home.vue     # 简历主页
        ├── Index.vue    # 随机页面索引
        └── *.vue        # 其他页面
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

## 📦 添加新页面

> ⚠️ **重要规则**：当 dax 要求生成新页面时，必须按照以下步骤操作！

**Index 页面** (`/#/index`) 是随机页面索引，用于链接 dax 生成的各种页面。

### 添加新页面步骤：

1. **创建 Vue 组件**：`src/views/YourPage.vue`
   
2. **添加路由**：在 `src/router.js` 中添加：
   ```js
   import YourPage from './views/YourPage.vue'
   // 在 routes 数组中添加：
   { path: '/your-page', component: YourPage }
   ```

3. **添加索引**：在 `src/views/Index.vue` 的 `pages` ref 中添加：
   ```js
   const pages = ref([
     { name: 'Your Page', desc: '页面描述', url: '/your-page', icon: '📄', date: '2026-03-10', category: '演示' },
   ])
   ```

4. **构建并推送**：
   ```bash
   cd /tmp/Pointbreaker.github.io
   npm run build
   git add -A && git commit -m "feat: 添加 Your Page" && git push
   ```

### Index 页面字段说明：
- `name`: 页面名称
- `desc`: 简短描述
- `url`: 路由路径（如 `/demo`）
- `icon`: emoji 图标（可选）
- `date`: 创建日期
- `category`: 分类（工具/游戏/演示/其他，可选）

### 已有页面：
- `/#/gravity` - Gravity Field（引力场模拟器）

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
