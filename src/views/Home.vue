<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// === 个人信息配置 ===
const profile = {
  name: 'dax',
  title: 'AI & Security Engineer',
  avatar: '🧑‍💻',
  bio: '热爱技术，专注于人工智能与网络安全领域。在CV/NLP和Pwn/Web方向有深入研究，持续探索前沿技术。',
  location: 'Shenzhen, China',
  email: 'hello@example.com',
  status: 'Tencent · 2025'
}

const education = [
  {
    degree: '硕士',
    school: '深圳大学',
    period: '2022 - 2024',
    major: '计算机科学'
  },
  {
    degree: '本科',
    school: '南昌大学',
    period: '2018 - 2022',
    major: '计算机科学与技术'
  }
]

const skills = [
  { name: 'Python', level: 95 },
  { name: 'Java', level: 85 },
  { name: 'C / C++', level: 88 },
  { name: '人工智能 (CV + NLP)', level: 90 },
  { name: '网络安全 (Pwn + Web)', level: 88 }
]

const experience = [
  {
    role: 'AI开发工程师',
    company: '腾讯',
    period: '2025.08 - 至今',
    desc: '负责AI模型开发与安全相关研究。'
  },
  {
    role: 'AI开发工程师',
    company: '深信服',
    period: '2024.07 - 2025.08',
    desc: '从事AI安全相关研发，参与威胁检测模型的设计与优化。'
  }
]

const links = [
  { name: 'GitHub', url: 'https://github.com/PointBreaker', icon: 'github' },
  { name: 'Email', url: 'mailto:hello@example.com', icon: 'email' }
]

// 更多项目链接（暂时为空）
const moreProjects = [
  // 示例：{ name: 'Blog', desc: '技术博客', url: '/blog' },
]

const currentSection = ref('about')
const navItems = [
  { key: 'about', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'index', label: 'Index', route: '/index' },
  { key: 'guestbook', label: 'Guestbook', route: '/guestbook' }
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
  
  // 创建粒子
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
    // 更新位置
    p.x += p.vx
    p.y += p.vy
    
    // 边界检测
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1
    
    // 绘制粒子
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`
    ctx.fill()
  })
  
  // 绘制连线
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
  <div class="resume">
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
        <router-link to="/" class="nav-logo">{{ profile.name }}</router-link>
        <div class="nav-links">
          <template v-for="item in navItems" :key="item.key">
            <router-link 
              v-if="item.route" 
              :to="item.route" 
              class="nav-link"
            >
              {{ item.label }}
            </router-link>
            <button 
              v-else
              :class="['nav-link', { active: currentSection === item.key }]"
              @click="currentSection = item.key"
            >
              {{ item.label }}
            </button>
          </template>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <div class="avatar-wrapper">
            <div class="avatar-glow"></div>
            <div class="avatar">{{ profile.avatar }}</div>
            <div class="status-badge">
              <span class="status-dot"></span>
              {{ profile.status }}
            </div>
          </div>
          
          <h1 class="name">{{ profile.name }}</h1>
          <p class="title">{{ profile.title }}</p>
          <p class="bio">{{ profile.bio }}</p>
          
          <div class="social-links">
            <a v-for="link in links" :key="link.name" :href="link.url" target="_blank" class="social-link">
              {{ link.name }}
            </a>
          </div>
        </div>
      </section>

      <!-- Sections -->
      <div class="sections">
        
        <!-- Education -->
        <section v-if="currentSection === 'about'" class="section about-section">
          <h2 class="section-title">Education</h2>
          <div class="education-list">
            <div v-for="(edu, i) in education" :key="i" class="education-item glass-card">
              <div class="edu-icon">{{ edu.degree === '硕士' ? '🎓' : '📚' }}</div>
              <div class="edu-content">
                <div class="edu-header">
                  <h3 class="edu-school">{{ edu.school }}</h3>
                </div>
                <p class="edu-degree">{{ edu.degree }} · {{ edu.major }}</p>
              </div>
            </div>
          </div>
          <h2 class="section-title" style="margin-top: 2rem;">Info</h2>
          <div class="about-grid">
            <div class="about-card glass-card">
              <span class="card-icon">📍</span>
              <span class="card-label">Location</span>
              <span class="card-value">{{ profile.location }}</span>
            </div>
            <div class="about-card glass-card">
              <span class="card-icon">🎯</span>
              <span class="card-label">Focus</span>
              <span class="card-value">AI & Security</span>
            </div>
            <div class="about-card glass-card">
              <span class="card-icon">🌐</span>
              <span class="card-label">Languages</span>
              <span class="card-value">EN / 中文</span>
            </div>
            <div class="about-card glass-card">
              <span class="card-icon">💻</span>
              <span class="card-label">Tech Stack</span>
              <span class="card-value">Python / C++ / Java</span>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section v-if="currentSection === 'skills'" class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            <div v-for="(skill, index) in skills" :key="skill.name" class="skill-item glass-card">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-percent">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div 
                  class="skill-fill" 
                  :style="{ 
                    '--target-width': skill.level + '%',
                    'animation-delay': (index * 0.15) + 's'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Experience -->
        <section v-if="currentSection === 'experience'" class="section">
          <h2 class="section-title">Experience</h2>
          <div class="timeline">
            <div v-for="(exp, i) in experience" :key="i" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content glass-card">
                <div class="timeline-header">
                  <h3 class="timeline-role">{{ exp.role }}</h3>
                  <span class="timeline-period">{{ exp.period }}</span>
                </div>
                <p class="timeline-company">{{ exp.company }}</p>
                <p class="timeline-desc">{{ exp.desc }}</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <!-- More Projects -->
    <section v-if="moreProjects.length > 0" class="more-projects">
      <h2 class="more-title">More</h2>
      <div class="more-grid">
        <router-link v-for="p in moreProjects" :key="p.name" :to="p.url" class="more-card glass-card">
          <span class="more-name">{{ p.name }}</span>
          <span class="more-desc">{{ p.desc }}</span>
          <span class="more-arrow">→</span>
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2026 {{ profile.name }}</span>
      <span class="divider">·</span>
      <span>Built with Vue</span>
    </footer>
  </div>
</template>

<style scoped>
/* === Resume Page Styles === */
.resume {
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
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: var(--accent);
  background: rgba(99, 102, 241, 0.1);
}

/* Hero */
.hero {
  text-align: center;
  padding: 3rem 0 4rem;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

/* 头像发光效果 */
.avatar-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse-glow 3s ease-in-out infinite;
  filter: blur(20px);
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.avatar {
  position: relative;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 2px solid rgba(99, 102, 241, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  animation: float 4s ease-in-out infinite;
  box-shadow: 
    0 0 40px rgba(99, 102, 241, 0.3),
    inset 0 0 20px rgba(99, 102, 241, 0.1);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.status-badge {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(15, 15, 25, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
  box-shadow: 0 0 8px #22c55e;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title {
  font-size: 1.125rem;
  background: linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
  margin-bottom: 1rem;
}

.bio {
  max-width: 480px;
  margin: 0 auto 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  line-height: 1.7;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.social-link {
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-link:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
}

/* Sections */
.sections {
  min-height: 300px;
}

.section {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* About Grid */
.about-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.about-card {
  border-radius: 12px;
  padding: 1.25rem;
}

.card-icon {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.card-label {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-value {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* Education */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.education-item {
  display: flex;
  gap: 1rem;
  border-radius: 12px;
  padding: 1.25rem;
}

.edu-icon {
  width: 48px;
  height: 48px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.edu-content {
  flex: 1;
}

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
}

.edu-school {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.edu-period {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
}

.edu-degree {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Skills */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  border-radius: 12px;
  padding: 1.25rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.skill-name {
  font-weight: 500;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
}

.skill-percent {
  font-size: 0.8125rem;
  color: var(--accent);
  font-weight: 600;
}

.skill-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, var(--accent) 0%, #a78bfa 50%, #ec4899 100%);
  border-radius: 3px;
  animation: fillBar 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: var(--animation-delay, 0s);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
  position: relative;
}

.skill-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes fillBar {
  from {
    width: 0;
  }
  to {
    width: var(--target-width);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: linear-gradient(180deg, var(--accent) 0%, transparent 100%);
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -1.5rem;
  top: 8px;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--accent);
  animation: pulse-marker 2s infinite;
}

@keyframes pulse-marker {
  0%, 100% {
    box-shadow: 0 0 15px var(--accent);
  }
  50% {
    box-shadow: 0 0 25px var(--accent);
  }
}

.timeline-content {
  border-radius: 12px;
  padding: 1.25rem;
  margin-left: 0.5rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
}

.timeline-role {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.timeline-period {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.timeline-company {
  font-size: 0.875rem;
  background: linear-gradient(90deg, var(--accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.timeline-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

/* More Projects */
.more-projects {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  position: relative;
  z-index: 10;
}

.more-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1rem;
}

.more-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.more-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.more-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
}

.more-desc {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
}

.more-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.3);
  font-size: 1rem;
  transition: all 0.3s;
}

.more-card:hover .more-arrow {
  transform: translateY(-50%) translateX(4px);
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
  
  .hero {
    padding: 2rem 0 3rem;
  }
  
  .name {
    font-size: 2rem;
  }
  
  .about-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline-header {
    flex-direction: column;
  }
  
  .timeline-period {
    margin-top: 0.25rem;
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
