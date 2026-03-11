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
    degree: '硕士 · 计算机科学',
    school: '深圳大学',
    year: '2022 - 2024',
    description: '专注于人工智能与计算机视觉方向的研究与应用。'
  },
  {
    id: 2,
    degree: '本科 · 计算机科学与技术',
    school: '南昌大学',
    year: '2018 - 2022',
    description: '计算机科学基础学习，对安全与编程产生兴趣。'
  }
]

const skills: SkillCategory[] = [
  {
    category: 'AI & ML',
    items: ['PyTorch', 'TensorFlow', 'Computer Vision', 'NLP', 'LLM']
  },
  {
    category: 'Security',
    items: ['Pwn', 'Web Security', 'CTF', 'Penetration Testing']
  },
  {
    category: 'Programming',
    items: ['Python', 'C/C++', 'Java', 'TypeScript', 'Go']
  },
  {
    category: 'Development',
    items: ['Vue.js', 'Django', 'Docker', 'MySQL', 'Linux']
  }
]

const experience: Experience[] = [
  {
    id: 1,
    title: 'AI开发工程师',
    company: '腾讯',
    period: '2025.08 - 至今',
    responsibilities: [
      '负责AI模型开发与安全相关研究',
      '探索前沿技术在业务场景中的应用'
    ]
  },
  {
    id: 2,
    title: 'AI开发工程师',
    company: '深信服',
    period: '2024.07 - 2025.08',
    responsibilities: [
      '从事AI安全相关研发',
      '参与威胁检测模型的设计与优化'
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
