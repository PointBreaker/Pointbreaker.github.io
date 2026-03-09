<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const feeds = ref([])
const lastUpdate = ref('')

// 热点数据（测试用，后续接入真实 API）
const mockNews = [
  // AI
  { category: 'AI', title: 'OpenAI 发布 GPT-5，性能大幅提升', source: 'TechCrunch', time: '2h', url: '#', hot: true },
  { category: 'AI', title: 'Claude 4 发布，支持超长上下文', source: 'Anthropic', time: '5h', url: '#', hot: true },
  { category: 'AI', title: 'Google DeepMind 新突破：AI 解决数学难题', source: 'Nature', time: '8h', url: '#' },
  { category: 'AI', title: '国内大模型价格战打响', source: '36氪', time: '12h', url: '#' },
  
  // 科技
  { category: '科技', title: '苹果 Vision Pro 2 或于今年发布', source: 'Bloomberg', time: '3h', url: '#', hot: true },
  { category: '科技', title: '特斯拉 FSD V13 开放测试', source: 'Electrek', time: '6h', url: '#' },
  { category: '科技', title: '英伟达市值突破 3 万亿美元', source: 'Reuters', time: '1d', url: '#' },
  
  // 互联网
  { category: '互联网', title: '微信测试新功能：AI 助手', source: '微信派', time: '4h', url: '#', hot: true },
  { category: '互联网', title: '抖音电商 GMV 突破 3 万亿', source: '晚点LatePost', time: '10h', url: '#' },
  { category: '互联网', title: '美团外卖推出无人机配送', source: '36氪', time: '1d', url: '#' },
]

const categories = ['全部', 'AI', '科技', '互联网']
const activeCategory = ref('全部')

const filteredNews = ref(mockNews)

const filterByCategory = (cat) => {
  activeCategory.value = cat
  if (cat === '全部') {
    filteredNews.value = mockNews
  } else {
    filteredNews.value = mockNews.filter(n => n.category === cat)
  }
}

onMounted(() => {
  // 模拟加载
  setTimeout(() => {
    loading.value = false
    lastUpdate.value = new Date().toLocaleString('zh-CN')
  }, 500)
})
</script>

<template>
  <div class="daily-page">
    <!-- Background -->
    <div class="bg-noise"></div>
    
    <!-- Header -->
    <header class="header">
      <router-link to="/" class="back-link">← dax</router-link>
      <h1 class="page-title">Daily</h1>
      <p class="page-desc">AI · 科技 · 互联网热点</p>
    </header>

    <!-- Category Filter -->
    <div class="category-bar">
      <button 
        v-for="cat in categories" 
        :key="cat"
        :class="['cat-btn', { active: activeCategory === cat }]"
        @click="filterByCategory(cat)"
      >
        {{ cat }}
      </button>
      <span class="update-time">{{ lastUpdate }}</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- News List -->
    <div v-else class="news-list">
      <a 
        v-for="(news, i) in filteredNews" 
        :key="i" 
        :href="news.url" 
        target="_blank"
        class="news-item"
      >
        <div class="news-main">
          <span class="news-category">{{ news.category }}</span>
          <span class="news-title">{{ news.title }}</span>
          <span class="news-source">{{ news.source }}</span>
        </div>
        <div class="news-meta">
          <span v-if="news.hot" class="hot-badge">🔥 热</span>
          <span class="news-time">{{ news.time }}</span>
        </div>
      </a>
    </div>

    <!-- Footer -->
    <footer class="daily-footer">
      <span>数据来源：RSS / API 聚合（测试版）</span>
    </footer>
  </div>
</template>

<style scoped>
.daily-page {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text);
  position: relative;
}

.bg-noise {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  z-index: 0;
}

/* Header */
.header {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  text-align: center;
  position: relative;
}

.back-link {
  position: absolute;
  left: 2rem;
  top: 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--accent);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

/* Category Bar */
.category-bar {
  max-width: 800px;
  margin: 0 auto 1.5rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cat-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.cat-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.cat-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.update-time {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--text-secondary);
  gap: 1rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* News List */
.news-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.news-item:hover {
  border-color: var(--accent);
  transform: translateX(4px);
  box-shadow: var(--shadow);
}

.news-main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.news-category {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.news-title {
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
}

.news-source {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.news-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}

.hot-badge {
  font-size: 0.6875rem;
  color: #f59e0b;
  font-weight: 600;
}

.news-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Footer */
.daily-footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

/* Responsive */
@media (max-width: 640px) {
  .header {
    padding: 2rem 1rem 1.5rem;
  }
  
  .back-link {
    left: 1rem;
    top: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .category-bar {
    padding: 0 1rem;
  }
  
  .news-list {
    padding: 0 1rem 3rem;
  }
  
  .news-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .news-meta {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
