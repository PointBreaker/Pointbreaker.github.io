<script setup>
import { ref } from 'vue'

// === 索引页面配置 ===
// 在这里添加 dax 让你生成的随机页面
const pages = ref([
  { name: 'Gravity Field', desc: '引力场模拟器 - 点击创建引力源', url: '/gravity', icon: '🌌', date: '2026-03-10', category: '演示' },
])

const categories = ['全部', '工具', '游戏', '演示', '其他']
const activeCategory = ref('全部')

const filteredPages = pages.value.length > 0 
  ? (activeCategory.value === '全部' ? pages.value : pages.value.filter(p => p.category === activeCategory.value))
  : []
</script>

<template>
  <div class="index-page">
    <!-- Background -->
    <div class="bg-noise"></div>
    
    <!-- Header -->
    <header class="header">
      <router-link to="/" class="back-link">← dax</router-link>
      <h1 class="page-title">Index</h1>
      <p class="page-desc">随机页面索引</p>
    </header>

    <!-- Category Filter -->
    <div v-if="pages.length > 0" class="category-bar">
      <button 
        v-for="cat in categories" 
        :key="cat"
        :class="['cat-btn', { active: activeCategory === cat }]"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="pages.length === 0" class="empty-state">
      <div class="empty-icon">📁</div>
      <h2>暂无页面</h2>
      <p>让 dax 生成新页面后，会自动出现在这里</p>
    </div>

    <!-- Page List -->
    <div v-else class="page-list">
      <router-link 
        v-for="(page, i) in filteredPages" 
        :key="i" 
        :to="page.url"
        class="page-item"
      >
        <span class="page-icon">{{ page.icon || '📄' }}</span>
        <div class="page-main">
          <span class="page-name">{{ page.name }}</span>
          <span class="page-desc">{{ page.desc }}</span>
        </div>
        <div class="page-meta">
          <span class="page-date">{{ page.date }}</span>
          <span class="page-arrow">→</span>
        </div>
      </router-link>
    </div>

    <!-- Footer -->
    <footer class="index-footer">
      <span>由 dax 生成 · 随机更新</span>
    </footer>
  </div>
</template>

<style scoped>
.index-page {
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

.cat-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.cat-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

/* Page List */
.page-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.page-item:hover {
  border-color: var(--accent);
  transform: translateX(4px);
  box-shadow: var(--shadow);
}

.page-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.page-main {
  flex: 1;
  min-width: 0;
}

.page-name {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.page-desc {
  display: block;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.page-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.page-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.page-arrow {
  color: var(--text-muted);
  transition: transform 0.2s;
}

.page-item:hover .page-arrow {
  transform: translateX(4px);
  color: var(--accent);
}

/* Footer */
.index-footer {
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
  
  .page-list {
    padding: 0 1rem 3rem;
  }
  
  .page-item {
    flex-wrap: wrap;
  }
  
  .page-meta {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
}
</style>
