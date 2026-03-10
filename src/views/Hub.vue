<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// === 时间显示 ===
const currentTime = ref(new Date())
const formattedTime = ref('')
const formattedDate = ref('')
let timeInterval = null

const updateTime = () => {
  currentTime.value = new Date()
  const now = currentTime.value
  
  formattedTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  formattedDate.value = now.toLocaleDateString('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// === 天气显示 ===
const weather = ref(null)
const weatherLoading = ref(true)
const weatherError = ref(false)

const fetchWeather = async () => {
  try {
    const res = await fetch('https://wttr.in/Shenzhen?format=j1')
    const data = await res.json()
    weather.value = {
      temp: data.current_condition[0].temp_C,
      desc: data.current_condition[0].weatherDesc[0].value,
      humidity: data.current_condition[0].humidity,
      windSpeed: data.current_condition[0].windspeedKmph,
      icon: getWeatherIcon(data.current_condition[0].weatherCode)
    }
  } catch (e) {
    weatherError.value = true
    console.error('获取天气失败:', e)
  } finally {
    weatherLoading.value = false
  }
}

const getWeatherIcon = (code) => {
  const icons = {
    '113': '☀️', // Sunny
    '116': '⛅', // Partly cloudy
    '119': '☁️', // Cloudy
    '122': '🌫️', // Overcast
    '143': '🌫️', // Mist
    '176': '🌧️', // Patchy rain
    '179': '🌨️', // Patchy snow
    '182': '🌨️', // Patchy sleet
    '185': '🌨️', // Patchy freezing drizzle
    '200': '⛈️', // Thundery outbreaks
    '227': '🌨️', // Blowing snow
    '230': '❄️', // Blizzard
    '248': '🌫️', // Fog
    '260': '🌫️', // Freezing fog
    '263': '🌧️', // Patchy light drizzle
    '266': '🌧️', // Light drizzle
    '281': '🌧️', // Freezing drizzle
    '284': '🌧️', // Heavy freezing drizzle
    '293': '🌧️', // Patchy light rain
    '296': '🌧️', // Light rain
    '299': '🌧️', // Moderate rain at times
    '302': '🌧️', // Moderate rain
    '305': '🌧️', // Heavy rain at times
    '308': '🌧️', // Heavy rain
    '311': '🌧️', // Light freezing rain
    '314': '🌧️', // Moderate or heavy freezing rain
    '317': '🌨️', // Light sleet
    '320': '🌨️', // Moderate or heavy sleet
    '323': '🌨️', // Patchy light snow
    '326': '🌨️', // Light snow
    '329': '🌨️', // Patchy moderate snow
    '332': '🌨️', // Moderate snow
    '335': '🌨️', // Patchy heavy snow
    '338': '🌨️', // Heavy snow
    '350': '🌨️', // Ice pellets
    '353': '🌧️', // Light rain shower
    '356': '🌧️', // Moderate or heavy rain shower
    '359': '🌧️', // Torrential rain shower
    '362': '🌨️', // Light sleet showers
    '365': '🌨️', // Moderate or heavy sleet showers
    '368': '🌨️', // Light snow showers
    '371': '🌨️', // Moderate or heavy snow showers
    '374': '🌨️', // Light showers of ice pellets
    '377': '🌨️', // Moderate or heavy showers of ice pellets
    '386': '⛈️', // Patchy light rain with thunder
    '389': '⛈️', // Moderate or heavy rain with thunder
    '392': '⛈️', // Patchy light snow with thunder
    '395': '⛈️', // Moderate or heavy snow with thunder
  }
  return icons[code] || '🌤️'
}

// === 每日名言 ===
const quotes = [
  { text: '千里之行，始于足下。', author: '老子' },
  { text: '学而不思则罔，思而不学则殆。', author: '孔子' },
  { text: '路漫漫其修远兮，吾将上下而求索。', author: '屈原' },
  { text: '业精于勤，荒于嬉；行成于思，毁于随。', author: '韩愈' },
  { text: '宝剑锋从磨砺出，梅花香自苦寒来。', author: '佚名' },
  { text: '天行健，君子以自强不息。', author: '周易' },
  { text: '非淡泊无以明志，非宁静无以致远。', author: '诸葛亮' },
  { text: '纸上得来终觉浅，绝知此事要躬行。', author: '陆游' },
  { text: '人生得意须尽欢，莫使金樽空对月。', author: '李白' },
  { text: '长风破浪会有时，直挂云帆济沧海。', author: '李白' }
]

const dailyQuote = ref(quotes[0])

const getRandomQuote = () => {
  // 使用日期作为种子，每天显示同一个名言
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const index = seed % quotes.length
  dailyQuote.value = quotes[index]
}

// === 快捷入口 ===
const quickLinks = [
  { name: 'GitHub', url: 'https://github.com/PointBreaker', icon: '🐙', color: '#333' },
  { name: 'Email', url: 'mailto:hello@example.com', icon: '📧', color: '#ea4335' },
  { name: 'Blog', url: 'https://daxd.top', icon: '📝', color: '#6366f1' },
  { name: 'Twitter', url: 'https://twitter.com', icon: '🐦', color: '#1da1f2' }
]

// === About Me ===
const aboutMe = {
  name: 'dax',
  title: 'AI & Security Engineer',
  bio: '热爱技术，专注于人工智能与网络安全领域。在 CV/NLP 和 Pwn/Web 方向有深入研究。',
  avatar: '🧑‍💻'
}

// === 当前状态 ===
const status = {
  text: 'Working at Tencent',
  emoji: '💼',
  updatedAt: '2025'
}

// === 导航 ===
const navItems = [
  { label: 'Hub', path: '/', active: true },
  { label: 'CV', path: '/cv' },
  { label: 'Links', path: '/links' },
  { label: 'Guestbook', path: '/guestbook' }
]

// === 粒子背景 ===
const particlesCanvas = ref(null)
let particles = []
let animationId = null
let ctx = null

const initParticles = () => {
  const canvas = particlesCanvas.value
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  resizeCanvas()
  
  const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
  particles = []
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2
    })
  }
  
  animate()
}

const resizeCanvas = () => {
  const canvas = particlesCanvas.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

const animate = () => {
  const canvas = particlesCanvas.value
  if (!canvas || !ctx) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1
    
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`
    ctx.fill()
  })
  
  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 120) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    })
  })
  
  animationId = requestAnimationFrame(animate)
}

// === 鼠标跟随光效 ===
const mouseX = ref(0)
const mouseY = ref(0)
const showCursorGlow = ref(false)

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  showCursorGlow.value = true
}

const handleMouseLeave = () => {
  showCursorGlow.value = false
}

// === 生命周期 ===
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  fetchWeather()
  getRandomQuote()
  initParticles()
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<template>
  <div class="hub-page">
    <!-- 粒子背景 Canvas -->
    <canvas ref="particlesCanvas" class="particles-bg"></canvas>
    
    <!-- 流动渐变背景 -->
    <div class="bg-gradient-animated"></div>
    
    <!-- 鼠标跟随光效 -->
    <div 
      class="cursor-glow" 
      :style="{ 
        left: mouseX + 'px', 
        top: mouseY + 'px',
        opacity: showCursorGlow ? 1 : 0
      }"
    ></div>

    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">{{ aboutMe.name }} hub</router-link>
        <div class="nav-links">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path" 
            class="nav-link"
            :class="{ active: $route.path === item.path }"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <!-- Top Row: Time/Weather + Quote -->
      <div class="top-row">
        <!-- Time & Weather Card -->
        <div class="card time-weather-card glass-card">
          <div class="time-display">
            <div class="time">{{ formattedTime }}</div>
            <div class="date">{{ formattedDate }}</div>
          </div>
          <div class="divider"></div>
          <div class="weather-display" v-if="weather && !weatherLoading">
            <div class="weather-icon">{{ weather.icon }}</div>
            <div class="weather-info">
              <div class="weather-temp">{{ weather.temp }}°C</div>
              <div class="weather-desc">{{ weather.desc }}</div>
              <div class="weather-details">
                <span>💧 {{ weather.humidity }}%</span>
                <span>💨 {{ weather.windSpeed }} km/h</span>
              </div>
            </div>
          </div>
          <div class="weather-loading" v-else-if="weatherLoading">
            <div class="loading-spinner"></div>
          </div>
          <div class="weather-error" v-else>
            加载天气失败
          </div>
        </div>

        <!-- Quote Card -->
        <div class="card quote-card glass-card">
          <div class="quote-icon">💭</div>
          <div class="quote-text">{{ dailyQuote.text }}</div>
          <div class="quote-author">—— {{ dailyQuote.author }}</div>
        </div>
      </div>

      <!-- Quick Links Grid -->
      <div class="quick-links-section">
        <h2 class="section-title">快捷入口</h2>
        <div class="quick-links-grid">
          <a 
            v-for="link in quickLinks" 
            :key="link.name"
            :href="link.url" 
            target="_blank"
            class="quick-link-card glass-card"
          >
            <span class="quick-link-icon">{{ link.icon }}</span>
            <span class="quick-link-name">{{ link.name }}</span>
          </a>
        </div>
      </div>

      <!-- Bottom Row: About Me + Status -->
      <div class="bottom-row">
        <!-- About Me Card -->
        <div class="card about-card glass-card">
          <div class="about-header">
            <div class="about-avatar">{{ aboutMe.avatar }}</div>
            <div class="about-info">
              <h3 class="about-name">{{ aboutMe.name }}</h3>
              <p class="about-title">{{ aboutMe.title }}</p>
            </div>
          </div>
          <p class="about-bio">{{ aboutMe.bio }}</p>
        </div>

        <!-- Status Card -->
        <div class="card status-card glass-card">
          <div class="status-header">
            <span class="status-icon">{{ status.emoji }}</span>
            <span class="status-label">当前状态</span>
          </div>
          <p class="status-text">{{ status.text }}</p>
          <span class="status-time">更新于 {{ status.updatedAt }}</span>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2026 {{ aboutMe.name }}</span>
      <span class="divider">·</span>
      <span>Built with Vue</span>
    </footer>
  </div>
</template>

<style scoped>
/* === Hub Page Styles === */
.hub-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
  position: relative;
  overflow-x: hidden;
}

/* === 粒子背景 === */
.particles-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* === 流动渐变背景 === */
.bg-gradient-animated {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  animation: gradientShift 15s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;
}

@keyframes gradientShift {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(-5deg);
    opacity: 1;
  }
}

/* === 鼠标跟随光效 === */
.cursor-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
}

/* === 玻璃态卡片 === */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 
    0 12px 40px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Main Content */
.main {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
  padding: 6rem 2rem 4rem;
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 0;
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--accent);
  background: rgba(99, 102, 241, 0.1);
}

/* Top Row */
.top-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card {
  border-radius: 16px;
  padding: 1.5rem;
}

/* Time & Weather Card */
.time-weather-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-display {
  text-align: center;
}

.time {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.date {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.25rem;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.weather-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-icon {
  font-size: 2.5rem;
}

.weather-info {
  flex: 1;
}

.weather-temp {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.weather-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
}

.weather-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.weather-loading,
.weather-error {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.5);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Quote Card */
.quote-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.quote-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  opacity: 0.2;
}

.quote-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.quote-author {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
}

/* Quick Links Section */
.quick-links-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.quick-link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  text-decoration: none;
  color: inherit;
  border-radius: 12px;
}

.quick-link-icon {
  font-size: 2rem;
}

.quick-link-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

/* Bottom Row */
.bottom-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1rem;
}

/* About Me Card */
.about-card {
  display: flex;
  flex-direction: column;
}

.about-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.about-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 2px solid rgba(99, 102, 241, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.about-info {
  flex: 1;
}

.about-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 0.25rem;
}

.about-title {
  font-size: 0.875rem;
  background: linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
}

.about-bio {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

/* Status Card */
.status-card {
  display: flex;
  flex-direction: column;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.status-icon {
  font-size: 1.25rem;
}

.status-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
}

.status-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.status-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Footer */
.footer {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8125rem;
  position: relative;
  z-index: 10;
}

.footer .divider {
  margin: 0 0.5rem;
  height: auto;
  background: none;
  display: inline;
}

/* Responsive */
@media (max-width: 768px) {
  .main {
    padding: 5rem 1rem 3rem;
  }
  
  .top-row {
    grid-template-columns: 1fr;
  }
  
  .bottom-row {
    grid-template-columns: 1fr;
  }
  
  .quick-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .time {
    font-size: 2rem;
  }
  
  .quote-text {
    font-size: 1.125rem;
  }
  
  .cursor-glow {
    display: none;
  }
}

@media (max-width: 640px) {
  .nav-inner {
    padding: 0 1rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.625rem;
    font-size: 0.8125rem;
  }
}
</style>
