<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// === 链接配置 ===
const socialLinks = [
  { 
    name: 'GitHub', 
    url: 'https://github.com/PointBreaker', 
    icon: '🐙', 
    desc: '开源项目 & 代码仓库',
    color: '#333'
  },
  { 
    name: 'Email', 
    url: 'mailto:hello@example.com', 
    icon: '📧', 
    desc: 'hello@example.com',
    color: '#ea4335'
  },
  { 
    name: 'Twitter', 
    url: 'https://twitter.com', 
    icon: '🐦', 
    desc: '@username',
    color: '#1da1f2'
  },
  { 
    name: 'Blog', 
    url: 'https://daxd.top', 
    icon: '📝', 
    desc: '技术博客 & 随笔',
    color: '#6366f1'
  }
]

const projectLinks = [
  {
    name: 'Personal Hub',
    url: '/',
    icon: '🏠',
    desc: '个人导航主页',
    internal: true
  },
  {
    name: 'Crypto Market',
    url: '/crypto',
    icon: '₿',
    desc: '加密货币实时行情与市场分析',
    internal: true
  },
  {
    name: 'Gravity Field',
    url: '/gravity',
    icon: '🌌',
    desc: '引力场模拟器 - 点击创建引力源',
    internal: true
  }
]

const otherLinks = [
  {
    name: 'Index',
    url: '/index',
    icon: '📁',
    desc: '随机页面索引',
    internal: true
  },
  {
    name: 'Guestbook',
    url: '/guestbook',
    icon: '💬',
    desc: '留言板',
    internal: true
  }
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
  initParticles()
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<template>
  <div class="links-page">
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
        <router-link to="/" class="nav-logo">dax hub</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Hub</router-link>
          <router-link to="/cv" class="nav-link">CV</router-link>
          <router-link to="/links" class="nav-link active">Links</router-link>
          <router-link to="/guestbook" class="nav-link">Guestbook</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <!-- Header -->
      <header class="header">
        <h1 class="page-title">🔗 链接汇总</h1>
        <p class="page-desc">所有链接都在这里</p>
      </header>

      <!-- Social Links Section -->
      <section class="section">
        <h2 class="section-title">社交链接</h2>
        <div class="links-grid">
          <a 
            v-for="link in socialLinks" 
            :key="link.name"
            :href="link.url" 
            target="_blank"
            class="link-card glass-card"
          >
            <div class="link-icon">{{ link.icon }}</div>
            <div class="link-info">
              <h3 class="link-name">{{ link.name }}</h3>
              <p class="link-desc">{{ link.desc }}</p>
            </div>
            <span class="link-arrow">→</span>
          </a>
        </div>
      </section>

      <!-- Project Links Section -->
      <section class="section">
        <h2 class="section-title">项目链接</h2>
        <div class="links-grid">
          <router-link 
            v-for="link in projectLinks" 
            :key="link.name"
            :to="link.url"
            class="link-card glass-card"
          >
            <div class="link-icon">{{ link.icon }}</div>
            <div class="link-info">
              <h3 class="link-name">{{ link.name }}</h3>
              <p class="link-desc">{{ link.desc }}</p>
            </div>
            <span class="link-arrow">→</span>
          </router-link>
        </div>
      </section>

      <!-- Other Links Section -->
      <section class="section">
        <h2 class="section-title">其他链接</h2>
        <div class="links-grid">
          <router-link 
            v-for="link in otherLinks" 
            :key="link.name"
            :to="link.url"
            class="link-card glass-card"
          >
            <div class="link-icon">{{ link.icon }}</div>
            <div class="link-info">
              <h3 class="link-name">{{ link.name }}</h3>
              <p class="link-desc">{{ link.desc }}</p>
            </div>
            <span class="link-arrow">→</span>
          </router-link>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2026 dax</span>
      <span class="divider">·</span>
      <span>Built with Vue</span>
    </footer>
  </div>
</template>

<style scoped>
/* === Links Page Styles === */
.links-page {
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
  max-width: 900px;
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
  max-width: 900px;
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

/* Header */
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.page-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
}

/* Section */
.section {
  margin-bottom: 2.5rem;
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

/* Links Grid */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.link-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-name {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 0.25rem;
}

.link-desc {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-arrow {
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.25rem;
  transition: all 0.3s;
}

.link-card:hover .link-arrow {
  transform: translateX(4px);
  color: var(--accent);
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

.divider {
  margin: 0 0.5rem;
}

/* Responsive */
@media (max-width: 640px) {
  .main {
    padding: 5rem 1rem 3rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .cursor-glow {
    display: none;
  }
  
  .nav-inner {
    padding: 0 1rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.625rem;
    font-size: 0.8125rem;
  }
}
</style>
