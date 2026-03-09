<script setup>
import { ref, onMounted, computed } from 'vue'

const loading = ref(true)
const feeds = ref([])
const lastUpdate = ref('')
const error = ref('')

// RSS 数据源配置（通过 rss2json 代理）
const RSS_SOURCES = [
  // AI & 科技
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage', category: '科技', icon: '📰' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: '科技', icon: '🔧' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/full.xml', category: '科技', icon: '📱' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', category: '科技', icon: '💼' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/feed', category: '产品', icon: '🚀' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: '科技', icon: '🔌' },
]

const categories = ['全部', '科技', '产品', 'AI']
const activeCategory = ref('全部')

const filteredFeeds = computed(() => {
  if (activeCategory.value === '全部') return feeds.value
  return feeds.value.filter(f => f.category === activeCategory.value)
})

const filterByCategory = (cat) => {
  activeCategory.value = cat
}

// RSS 转 JSON 代理服务
const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='

async function fetchFeed(source) {
  try {
    const res = await fetch(RSS_PROXY + encodeURIComponent(source.url))
    const data = await res.json()
    
    if (data.status === 'ok' && data.items) {
      return data.items.slice(0, 5).map(item => ({
        title: item.title,
        url: item.link,
        source: source.name,
        category: source.category,
        icon: source.icon,
        time: formatTime(item.pubDate),
        hot: false
      }))
    }
    return []
  } catch (e) {
    console.error(`Failed to fetch ${source.name}:`, e)
    return []
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

async function loadFeeds() {
  loading.value = true
  error.value = ''
  
  try {
    const results = await Promise.all(RSS_SOURCES.map(fetchFeed))
    const allItems = results.flat()
    
    // 按时间排序
    allItems.sort((a, b) => {
      if (!a.time || !b.time) return 0
      return a.time.localeCompare(b.time)
    })
    
    // 标记热门（前5个）
    allItems.slice(0, 5).forEach(item => item.hot = true)
    
    feeds.value = allItems
    lastUpdate.value = new Date().toLocaleString('zh-CN')
  } catch (e) {
    error.value = '加载失败，请稍后重试'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFeeds()
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
      <button class="cat-btn refresh-btn" @click="loadFeeds" :disabled="loading">
        {{ loading ? '...' : '↻' }}
      </button>
      <span class="update-time">{{ lastUpdate }}</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="error-msg">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="loading && feeds.length === 0" class="loading">
      <div class="spinner"></div>
      <span>抓取热点中...</span>
    </div>

    <!-- News List -->
    <div v-else class="news-list">
      <a 
        v-for="(news, i) in filteredFeeds" 
        :key="i" 
        :href="news.url" 
        target="_blank"
        rel="noopener"
        class="news-item"
      >
        <div class="news-main">
          <div class="news-header">
            <span class="news-icon">{{ news.icon }}</span>
            <span class="news-category">{{ news.category }}</span>
            <span class="news-source">{{ news.source }}</span>
          </div>
          <span class="news-title">{{ news.title }}</span>
        </div>
        <div class="news-meta">
          <span v-if="news.hot" class="hot-badge">🔥</span>
          <span class="news-time">{{ news.time }}</span>
        </div>
      </a>
      
      <div v-if="filteredFeeds.length === 0" class="empty-state">
        暂无内容
      </div>
    </div>

    <!-- Footer -->
    <footer class="daily-footer">
      <span>数据来源：Hacker News · TechCrunch · The Verge · VentureBeat · Product Hunt · Wired</span>
    </footer>
  </div>
</template>

<style scoped>
.daily-page {
  min-height: 100vh;
  background: var(--bg);
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

.cat-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.cat-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.cat-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn {
  padding: 0.5rem 0.75rem;
}

.update-time {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Error */
.error-msg {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  color: #ef4444;
  font-size: 0.875rem;
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
  gap: 0.375rem;
  flex: 1;
  min-width: 0;
}

.news-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.news-icon {
  font-size: 0.875rem;
}

.news-category {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.news-source {
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.news-title {
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
  margin-left: 1rem;
}

.hot-badge {
  font-size: 0.875rem;
}

.news-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

/* Footer */
.daily-footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.75rem;
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
  
  .update-time {
    width: 100%;
    margin-left: 0;
    margin-top: 0.5rem;
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
    margin-left: 0;
  }
}
</style>
