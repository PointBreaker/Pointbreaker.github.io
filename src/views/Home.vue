<script setup>
import { ref } from 'vue'
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
  { key: 'daily', label: 'Daily', route: '/daily' }
]
</script>

<template>
  <div class="resume">
    <!-- Subtle Background -->
    <div class="bg-noise"></div>
    <div class="bg-gradient"></div>

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
            <div v-for="(edu, i) in education" :key="i" class="education-item">
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
            <div class="about-card">
              <span class="card-icon">📍</span>
              <span class="card-label">Location</span>
              <span class="card-value">{{ profile.location }}</span>
            </div>
            <div class="about-card">
              <span class="card-icon">🎯</span>
              <span class="card-label">Focus</span>
              <span class="card-value">AI & Security</span>
            </div>
            <div class="about-card">
              <span class="card-icon">🌐</span>
              <span class="card-label">Languages</span>
              <span class="card-value">EN / 中文</span>
            </div>
            <div class="about-card">
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
            <div v-for="skill in skills" :key="skill.name" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-percent">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
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
              <div class="timeline-content">
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
        <router-link v-for="p in moreProjects" :key="p.name" :to="p.url" class="more-card">
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

.bg-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* Main Content */
.main {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 2rem 4rem;
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

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #f0f0ff 0%, #e0e0ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: var(--shadow-lg);
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
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  box-shadow: var(--shadow);
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
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
}

.title {
  font-size: 1.125rem;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 1rem;
}

.bio {
  max-width: 480px;
  margin: 0 auto 2rem;
  color: var(--text-secondary);
  font-size: 1rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.social-link {
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
}

.social-link:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-1px);
}

/* Sections */
.sections {
  min-height: 300px;
}

.section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

/* About Grid */
.about-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.about-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  transition: all 0.2s;
}

.about-card:hover {
  border-color: var(--accent-light);
  box-shadow: var(--shadow);
}

.card-icon {
  display: block;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.card-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.card-value {
  font-weight: 600;
  color: var(--text);
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
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  transition: all 0.2s;
}

.education-item:hover {
  border-color: var(--accent-light);
}

.edu-icon {
  width: 44px;
  height: 44px;
  background: rgba(99, 102, 241, 0.08);
  border-radius: var(--radius-sm);
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
}

.edu-period {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.edu-degree {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Skills */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.skill-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.625rem;
}

.skill-name {
  font-weight: 500;
  font-size: 0.9375rem;
}

.skill-percent {
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-weight: 500;
}

.skill-bar {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
  border-radius: 2px;
  transition: width 0.6s ease;
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
  width: 1px;
  background: var(--border);
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
  width: 11px;
  height: 11px;
  background: var(--bg-card);
  border: 2px solid var(--accent);
  border-radius: 50%;
}

.timeline-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
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
}

.timeline-period {
  font-size: 0.8125rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.timeline-company {
  font-size: 0.875rem;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.timeline-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* More Projects */
.more-projects {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.more-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
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
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  position: relative;
}

.more-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.more-name {
  font-weight: 600;
  font-size: 0.9375rem;
}

.more-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.more-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1rem;
  transition: transform 0.2s;
}

.more-card:hover .more-arrow {
  transform: translateY(-50%) translateX(4px);
  color: var(--accent);
}

/* Footer */
.footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
  position: relative;
  z-index: 1;
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
}
</style>
