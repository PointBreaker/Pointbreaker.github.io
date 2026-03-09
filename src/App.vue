<script setup>
import { ref } from 'vue'

// === 个人信息配置 ===
const profile = {
  name: 'PointBreaker',
  title: 'Full-Stack Developer',
  avatar: '🧑‍💻',
  bio: 'Building elegant solutions to complex problems. Passionate about clean code, open source, and continuous learning.',
  location: 'Earth',
  email: 'hello@example.com',
  status: 'Open to opportunities'
}

const skills = [
  { name: 'JavaScript / TypeScript', level: 95 },
  { name: 'Vue / React', level: 90 },
  { name: 'Node.js', level: 85 },
  { name: 'Python', level: 80 },
  { name: 'Go', level: 70 },
  { name: 'Docker / K8s', level: 75 }
]

const experience = [
  {
    role: 'Senior Developer',
    company: 'Tech Company',
    period: '2023 - Present',
    desc: 'Leading frontend architecture and building scalable applications.'
  },
  {
    role: 'Full-Stack Developer',
    company: 'Startup',
    period: '2021 - 2023',
    desc: 'Built end-to-end features and improved system performance by 40%.'
  },
  {
    role: 'Junior Developer',
    company: 'Agency',
    period: '2019 - 2021',
    desc: 'Delivered 20+ client projects and mastered modern web technologies.'
  }
]

const projects = [
  {
    name: 'OpenClaw',
    desc: 'AI-powered personal assistant framework',
    tech: ['Vue', 'Node.js', 'AI'],
    link: 'https://github.com/PointBreaker'
  },
  {
    name: 'Project Alpha',
    desc: 'Real-time collaboration platform',
    tech: ['React', 'WebSocket', 'Go'],
    link: '#'
  },
  {
    name: 'DevTools',
    desc: 'Developer productivity toolkit',
    tech: ['TypeScript', 'Electron'],
    link: '#'
  }
]

const links = [
  { name: 'GitHub', url: 'https://github.com/PointBreaker', icon: 'github' },
  { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { name: 'Email', url: 'mailto:hello@example.com', icon: 'email' }
]

const currentSection = ref('about')
</script>

<template>
  <div class="resume">
    <!-- Subtle Background -->
    <div class="bg-noise"></div>
    <div class="bg-gradient"></div>

    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-inner">
        <span class="nav-logo">{{ profile.name }}</span>
        <div class="nav-links">
          <button 
            v-for="section in ['about', 'skills', 'experience', 'projects']" 
            :key="section"
            :class="['nav-link', { active: currentSection === section }]"
            @click="currentSection = section"
          >
            {{ section }}
          </button>
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
        
        <!-- About -->
        <section v-if="currentSection === 'about'" class="section about-section">
          <h2 class="section-title">About</h2>
          <div class="about-grid">
            <div class="about-card">
              <span class="card-icon">📍</span>
              <span class="card-label">Location</span>
              <span class="card-value">{{ profile.location }}</span>
            </div>
            <div class="about-card">
              <span class="card-icon">💼</span>
              <span class="card-label">Focus</span>
              <span class="card-value">Full-Stack Development</span>
            </div>
            <div class="about-card">
              <span class="card-icon">🚀</span>
              <span class="card-label">Experience</span>
              <span class="card-value">5+ Years</span>
            </div>
            <div class="about-card">
              <span class="card-icon">🌐</span>
              <span class="card-label">Languages</span>
              <span class="card-value">EN / 中文</span>
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

        <!-- Projects -->
        <section v-if="currentSection === 'projects'" class="section">
          <h2 class="section-title">Projects</h2>
          <div class="projects-grid">
            <a v-for="project in projects" :key="project.name" :href="project.link" target="_blank" class="project-card">
              <h3 class="project-name">{{ project.name }}</h3>
              <p class="project-desc">{{ project.desc }}</p>
              <div class="project-tech">
                <span v-for="tech in project.tech" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
            </a>
          </div>
        </section>

      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <span>© 2026 {{ profile.name }}</span>
      <span class="divider">·</span>
      <span>Built with Vue</span>
    </footer>
  </div>
</template>

<style>
/* === Reset & Base === */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #fafafa;
  --bg-card: #ffffff;
  --text: #1a1a2e;
  --text-secondary: #64648c;
  --text-muted: #9494b8;
  --accent: #6366f1;
  --accent-light: #818cf8;
  --border: #e5e5e5;
  --shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.08);
  --radius: 12px;
  --radius-sm: 6px;
}

.resume {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text);
  line-height: 1.6;
  position: relative;
}

/* === Background Effects === */
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

/* === Navigation === */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.nav-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--text);
}

.nav-links {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.nav-link:hover {
  color: var(--text);
  background: rgba(0,0,0,0.04);
}

.nav-link.active {
  color: var(--accent);
  background: rgba(99, 102, 241, 0.1);
}

/* === Main Content === */
.main {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 2rem 4rem;
}

/* === Hero === */
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

/* === Sections === */
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

/* About Section */
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

/* Skills Section */
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

/* Experience Timeline */
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

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.project-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.project-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
}

.project-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tech-tag {
  padding: 0.25rem 0.5rem;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
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

/* === Responsive === */
@media (max-width: 640px) {
  .nav-inner {
    padding: 0.875rem 1rem;
  }
  
  .nav-links {
    gap: 0;
  }
  
  .nav-link {
    padding: 0.5rem 0.625rem;
    font-size: 0.8125rem;
  }
  
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
