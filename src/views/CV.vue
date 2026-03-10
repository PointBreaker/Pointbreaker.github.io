<template>
  <div class="page-content">
    <h1 class="page-title slide-up">Curriculum Vitae</h1>

    <!-- Tab 切换 -->
    <div class="tabs slide-up" style="animation-delay: 0.1s">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 内容 -->
    <div class="tab-content slide-up" style="animation-delay: 0.2s">
      <!-- Education -->
      <div v-if="activeTab === 'education'" class="tab-section">
        <div v-for="edu in education" :key="edu.id" class="cv-item glass-card">
          <div class="cv-item-header">
            <h3>{{ edu.degree }}</h3>
            <span class="cv-year">{{ edu.year }}</span>
          </div>
          <p class="cv-school">{{ edu.school }}</p>
          <p class="cv-description">{{ edu.description }}</p>
        </div>
      </div>

      <!-- Skills -->
      <div v-if="activeTab === 'skills'" class="tab-section">
        <div v-for="category in skills" :key="category.category" class="skill-category glass-card">
          <h3>{{ category.category }}</h3>
          <div class="skills-list">
            <span v-for="skill in category.items" :key="skill" class="skill-tag">{{ skill }}</span>
          </div>
        </div>
      </div>

      <!-- Experience -->
      <div v-if="activeTab === 'experience'" class="tab-section">
        <div v-for="exp in experience" :key="exp.id" class="cv-item glass-card">
          <div class="cv-item-header">
            <h3>{{ exp.title }}</h3>
            <span class="cv-year">{{ exp.period }}</span>
          </div>
          <p class="cv-company">{{ exp.company }}</p>
          <ul class="cv-responsibilities">
            <li v-for="resp in exp.responsibilities" :key="resp">{{ resp }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Tab {
  id: string
  label: string
}

interface Education {
  id: number
  degree: string
  school: string
  year: string
  description: string
}

interface SkillCategory {
  category: string
  items: string[]
}

interface Experience {
  id: number
  title: string
  company: string
  period: string
  responsibilities: string[]
}

const tabs: Tab[] = [
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' }
]

const activeTab = ref('education')

const education: Education[] = [
  {
    id: 1,
    degree: 'Bachelor of Computer Science',
    school: 'University of Technology',
    year: '2018 - 2022',
    description: 'Specialized in Software Engineering with focus on Web Development and Machine Learning.'
  },
  {
    id: 2,
    degree: 'Master of Data Science',
    school: 'Tech Institute',
    year: '2022 - 2024',
    description: 'Advanced studies in Machine Learning, Data Engineering, and Distributed Systems.'
  }
]

const skills: SkillCategory[] = [
  {
    category: 'Programming Languages',
    items: ['TypeScript', 'Python', 'Java', 'Go', 'Rust']
  },
  {
    category: 'Frontend',
    items: ['Vue.js', 'React', 'Next.js', 'Vite', 'Tailwind CSS']
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'Fastify', 'Django', 'PostgreSQL']
  },
  {
    category: 'DevOps & Tools',
    items: ['Docker', 'Kubernetes', 'Git', 'CI/CD', 'AWS', 'Linux']
  },
  {
    category: 'Other',
    items: ['Machine Learning', 'Data Analysis', 'System Design', 'API Design']
  }
]

const experience: Experience[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    period: '2023 - Present',
    responsibilities: [
      'Lead development of microservices architecture',
      'Mentor junior developers and conduct code reviews',
      'Optimize system performance reducing latency by 40%'
    ]
  },
  {
    id: 2,
    title: 'Software Developer',
    company: 'Startup Inc',
    period: '2022 - 2023',
    responsibilities: [
      'Built full-stack web applications using Vue.js and Node.js',
      'Implemented RESTful APIs and database designs',
      'Collaborated with design team to create responsive UIs'
    ]
  },
  {
    id: 3,
    title: 'Intern Developer',
    company: 'Code Labs',
    period: '2021 - 2022',
    responsibilities: [
      'Assisted in developing and testing software features',
      'Participated in agile development processes',
      'Learned industry best practices and coding standards'
    ]
  }
]
</script>

<style scoped>
.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-button {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-color);
}

.tab-button.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.tab-content {
  min-height: 400px;
}

.tab-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cv-item {
  margin-bottom: 0;
}

.cv-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.cv-item-header h3 {
  font-size: 1.25rem;
  margin: 0;
}

.cv-year {
  padding: 4px 12px;
  background: rgba(124, 58, 237, 0.2);
  border-radius: 4px;
  font-size: 0.875rem;
  color: #a78bfa;
  font-weight: 500;
}

.cv-school,
.cv-company {
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: 8px;
}

.cv-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.cv-responsibilities {
  list-style: none;
  padding: 0;
  margin-top: 12px;
}

.cv-responsibilities li {
  padding-left: 20px;
  position: relative;
  color: var(--text-secondary);
  margin-bottom: 8px;
  line-height: 1.6;
}

.cv-responsibilities li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent-color);
}

.skill-category {
  margin-bottom: 0;
}

.skill-category h3 {
  margin-bottom: 16px;
  font-size: 1.125rem;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  padding: 8px 16px;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 6px;
  font-size: 0.875rem;
  color: #a78bfa;
  font-weight: 500;
  transition: var(--transition);
}

.skill-tag:hover {
  background: rgba(124, 58, 237, 0.25);
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .tabs {
    gap: 8px;
  }

  .tab-button {
    padding: 10px 16px;
    font-size: 0.8125rem;
  }

  .cv-item-header {
    flex-direction: column;
  }
}
</style>
