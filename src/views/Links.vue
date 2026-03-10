<template>
  <div class="page-content">
    <h1 class="page-title slide-up">Links</h1>

    <!-- 社交链接 -->
    <section class="link-section slide-up" style="animation-delay: 0.1s">
      <h2 class="section-title">Social Media</h2>
      <div class="links-grid">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          class="link-card glass-card"
          target="_blank"
        >
          <span class="link-icon">{{ link.icon }}</span>
          <div class="link-info">
            <h3>{{ link.name }}</h3>
            <p>{{ link.description }}</p>
          </div>
        </a>
      </div>
    </section>

    <!-- 项目链接 -->
    <section class="link-section slide-up" style="animation-delay: 0.2s">
      <h2 class="section-title">Projects</h2>
      <div class="links-grid">
        <a
          v-for="project in projectLinks"
          :key="project.name"
          :href="project.url"
          class="link-card glass-card"
          target="_blank"
        >
          <span class="link-icon">{{ project.icon }}</span>
          <div class="link-info">
            <h3>{{ project.name }}</h3>
            <p>{{ project.description }}</p>
          </div>
        </a>
      </div>
    </section>

    <!-- 其他链接 -->
    <section class="link-section slide-up" style="animation-delay: 0.3s">
      <h2 class="section-title">Other</h2>
      <div class="links-grid">
        <a
          v-for="link in otherLinks"
          :key="link.name"
          :href="link.url"
          class="link-card glass-card"
          target="_blank"
        >
          <span class="link-icon">{{ link.icon }}</span>
          <div class="link-info">
            <h3>{{ link.name }}</h3>
            <p>{{ link.description }}</p>
          </div>
        </a>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="contact-section slide-up" style="animation-delay: 0.4s">
      <div class="glass-card contact-card">
        <h2>Get in Touch</h2>
        <p>Want to connect? Feel free to reach out!</p>
        <div class="contact-links">
          <a href="mailto:your@email.com" class="contact-link">
            <span class="contact-icon">📧</span>
            your@email.com
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Link {
  name: string
  url: string
  icon: string
  description: string
}

const socialLinks: Link[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/Pointbreaker',
    icon: '🐙',
    description: 'Check out my open source projects'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/yourhandle',
    icon: '🐦',
    description: 'Follow me for updates and thoughts'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/yourprofile',
    icon: '💼',
    description: 'Connect with me professionally'
  },
  {
    name: 'Blog',
    url: 'https://yourblog.com',
    icon: '📝',
    description: 'Read my latest articles'
  }
]

const projectLinks: Link[] = [
  {
    name: 'Personal Hub',
    url: 'https://github.com/Pointbreaker/personal-hub',
    icon: '🏠',
    description: 'This website - open source on GitHub'
  },
  {
    name: 'Project Alpha',
    url: 'https://github.com/Pointbreaker/project-alpha',
    icon: '⚡',
    description: 'A cool project I\'m working on'
  },
  {
    name: 'Utility Tools',
    url: 'https://github.com/Pointbreaker/utils',
    icon: '🛠️',
    description: 'Collection of useful utilities'
  }
]

const otherLinks: Link[] = [
  {
    name: 'Guestbook',
    url: '/guestbook',
    icon: '📖',
    description: 'Leave a message!'
  },
  {
    name: 'Gravity',
    url: '/gravity',
    icon: '🌌',
    description: 'Interactive gravity simulation'
  }
]
</script>

<style scoped>
.page-title {
  text-align: center;
  margin-bottom: 48px;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.link-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: var(--text-secondary);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.link-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
  margin-bottom: 0;
}

.link-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-color);
}

.link-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.link-info {
  flex: 1;
}

.link-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.link-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.contact-section {
  margin-top: 48px;
}

.contact-card {
  text-align: center;
  padding: 40px;
  margin-bottom: 0;
}

.contact-card h2 {
  font-size: 1.75rem;
  margin-bottom: 12px;
}

.contact-card p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  color: #a78bfa;
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.contact-link:hover {
  background: rgba(124, 58, 237, 0.25);
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.contact-icon {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  .contact-card {
    padding: 24px;
  }
}
</style>
