<template>
  <div class="hub-container">
    <!-- 时间显示 -->
    <div class="time-section slide-up" style="animation-delay: 0.1s">
      <div class="time-display">{{ currentTime }}</div>
      <div class="date-display">{{ currentDate }}</div>
    </div>

    <!-- 内容网格 -->
    <div class="content-grid">
      <!-- 天气卡片 -->
      <div class="glass-card weather-card slide-up" style="animation-delay: 0.2s">
        <div class="card-header">
          <h3>Weather</h3>
          <span class="location">📍 Shenzhen</span>
        </div>
        <div class="weather-content" v-if="weather">
          <div class="temperature">{{ weather.temp }}°C</div>
          <div class="condition">{{ weather.condition }}</div>
          <div class="weather-details">
            <span>💧 {{ weather.humidity }}%</span>
            <span>💨 {{ weather.wind }} km/h</span>
          </div>
        </div>
        <div class="weather-content" v-else>
          <div class="loading">Loading...</div>
        </div>
      </div>

      <!-- 每日名言 -->
      <div class="glass-card quote-card slide-up" style="animation-delay: 0.3s">
        <div class="card-header">
          <h3>Daily Quote</h3>
        </div>
        <div class="quote-content">
          <p class="quote-text">"{{ dailyQuote.text }}"</p>
          <p class="quote-author">— {{ dailyQuote.author }}</p>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="glass-card shortcuts-card slide-up" style="animation-delay: 0.4s">
        <div class="card-header">
          <h3>Quick Links</h3>
        </div>
        <div class="shortcuts-grid">
          <a
            v-for="link in shortcuts"
            :key="link.name"
            :href="link.url"
            class="shortcut-item"
            target="_blank"
          >
            <span class="shortcut-icon">{{ link.icon }}</span>
            <span class="shortcut-name">{{ link.name }}</span>
          </a>
        </div>
      </div>

      <!-- About Me -->
      <div class="glass-card about-card slide-up" style="animation-delay: 0.5s">
        <div class="card-header">
          <h3>About Me</h3>
        </div>
        <div class="about-content">
          <p>{{ aboutMe }}</p>
          <div class="about-links">
            <router-link to="/cv" class="about-link">View CV →</router-link>
            <router-link to="/links" class="about-link">Links →</router-link>
            <router-link to="/guestbook" class="about-link">Guestbook →</router-link>
          </div>
        </div>
      </div>

      <!-- 访问统计 -->
      <div class="glass-card stats-card slide-up" style="animation-delay: 0.6s">
        <div class="card-header">
          <h3>📊 Visits</h3>
          <span class="total-visits">Total: {{ visitStats.total }}</span>
        </div>
        <div class="stats-content">
          <div class="stats-chart">
            <div
              v-for="(day, index) in recentVisits"
              :key="day.date"
              class="chart-bar-container"
            >
              <div class="chart-bar-wrapper">
                <div
                  class="chart-bar"
                  :style="{ height: getBarHeight(day.count) + '%' }"
                ></div>
              </div>
              <span class="chart-label">{{ getDayLabel(day.date, index) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Weather {
  temp: number
  condition: string
  humidity: number
  wind: number
}

interface Quote {
  text: string
  author: string
}

interface Shortcut {
  name: string
  url: string
  icon: string
}

interface VisitStats {
  daily: Array<{ date: string; count: number }>
  total: number
}

const API_BASE = 'https://daxd.top:4433/api'

const currentTime = ref('')
const currentDate = ref('')
const weather = ref<Weather | null>(null)
const dailyQuote = ref<Quote>({ text: '', author: '' })
const aboutMe = ref('Hello! I\'m a passionate developer exploring the intersection of technology and creativity. Welcome to my personal hub.')
const visitStats = ref<VisitStats>({ daily: [], total: 0 })

const shortcuts: Shortcut[] = [
  { name: 'GitHub', url: 'https://github.com/Pointbreaker', icon: '🐙' },
  { name: 'Email', url: 'mailto:your@email.com', icon: '📧' },
  { name: 'Blog', url: 'https://yourblog.com', icon: '📝' },
  { name: 'Twitter', url: 'https://twitter.com/yourhandle', icon: '🐦' }
]

const quotes: Quote[] = [
  { text: 'The only way to do great work is to love what you do', author: 'Steve Jobs' },
  { text: 'Code is poetry', author: 'Automattic' },
  { text: 'Simplicity is the ultimate sophistication', author: 'Leonardo da Vinci' },
  { text: 'Talk is cheap. Show me the code', author: 'Linus Torvalds' },
  { text: 'Stay hungry, stay foolish', author: 'Steve Jobs' },
  { text: 'The best way to predict the future is to invent it', author: 'Alan Kay' },
  { text: 'Technology is best when it brings people together', author: 'Matt Mullenweg' },
  { text: 'Make it work, make it right, make it fast', author: 'Kent Beck' }
]

// 获取最近7天的访问数据
const recentVisits = computed(() => {
  return visitStats.value.daily.slice(-7)
})

// 计算柱状图高度
const getBarHeight = (count: number) => {
  const maxCount = Math.max(...recentVisits.value.map(d => d.count), 1)
  return Math.max((count / maxCount) * 100, 2)
}

// 获取日期标签
const getDayLabel = (dateStr: string, index: number) => {
  const date = new Date(dateStr)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  
  if (isToday) return 'Today'
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getDay()]
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDailyQuote = () => {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
  const index = dayOfYear % quotes.length
  dailyQuote.value = quotes[index]
}

const fetchWeather = async () => {
  try {
    const response = await fetch('https://wttr.in/Shenzhen?format=j1')
    const data = await response.json()
    const current = data.current_condition[0]
    weather.value = {
      temp: parseInt(current.temp_C),
      condition: current.weatherDesc[0].value,
      humidity: parseInt(current.humidity),
      wind: parseInt(current.windspeedKmph)
    }
  } catch (error) {
    console.error('Failed to fetch weather:', error)
    weather.value = {
      temp: 25,
      condition: 'Partly Cloudy',
      humidity: 65,
      wind: 10
    }
  }
}

const fetchVisitStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/visits/stats/`)
    visitStats.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch visit stats:', error)
  }
}

const recordVisit = async () => {
  try {
    await fetch(`${API_BASE}/visits/record/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.hash || '/' })
    })
  } catch (error) {
    console.error('Failed to record visit:', error)
  }
}

let timeInterval: number | null = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000) as unknown as number
  getDailyQuote()
  fetchWeather()
  fetchVisitStats()
  recordVisit()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.hub-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}

.time-section {
  text-align: center;
  margin-bottom: 60px;
}

.time-display {
  font-size: 5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.date-display {
  font-size: 1.25rem;
  color: var(--text-secondary);
  font-weight: 300;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.location {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.weather-content {
  text-align: center;
}

.temperature {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.condition {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.weather-details {
  display: flex;
  justify-content: center;
  gap: 24px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.loading {
  color: var(--text-secondary);
  font-style: italic;
}

.quote-content {
  text-align: center;
}

.quote-text {
  font-size: 1.125rem;
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 12px;
}

.quote-author {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  transition: var(--transition);
  cursor: pointer;
}

.shortcut-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  border-color: var(--accent-color);
}

.shortcut-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.shortcut-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.about-content p {
  line-height: 1.6;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.about-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.about-link {
  color: var(--accent-color);
  font-weight: 500;
  transition: var(--transition);
}

.about-link:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

.total-visits {
  font-size: 0.875rem;
  color: var(--accent-color);
  font-weight: 600;
}

.stats-content {
  padding: 10px 0;
}

.stats-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  gap: 8px;
}

.chart-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.chart-bar-wrapper {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bar {
  width: 80%;
  max-width: 40px;
  background: linear-gradient(180deg, var(--accent-color) 0%, rgba(124, 58, 237, 0.3) 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  min-height: 4px;
}

.chart-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}

@media (max-width: 768px) {
  .time-display {
    font-size: 3rem;
  }

  .date-display {
    font-size: 1rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .temperature {
    font-size: 3rem;
  }

  .shortcuts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
