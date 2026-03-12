<template>
  <div class="course-container">
    <div class="course-header slide-up">
      <h1>CS336: Language Modeling from Scratch</h1>
      <p class="subtitle">Stanford University • Spring 2025</p>
      <div class="progress-overview">
        <div class="progress-item">
          <span class="label">Lectures</span>
          <span class="value">{{ lectureProgress }}/{{ lectures.length }}</span>
        </div>
        <div class="progress-item">
          <span class="label">Assignments</span>
          <span class="value">{{ assignmentProgress }}/{{ assignments.length }}</span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs slide-up" style="animation-delay: 0.1s">
      <button 
        :class="['tab', { active: activeTab === 'lectures' }]"
        @click="activeTab = 'lectures'"
      >
        📚 Lectures ({{ lectures.length }})
      </button>
      <button 
        :class="['tab', { active: activeTab === 'assignments' }]"
        @click="activeTab = 'assignments'"
      >
        📝 Assignments ({{ assignments.length }})
      </button>
      <button 
        :class="['tab', { active: activeTab === 'notes' }]"
        @click="activeTab = 'notes'"
      >
        📓 My Notes
      </button>
    </div>

    <!-- Lectures Tab -->
    <div v-if="activeTab === 'lectures'" class="content-section">
      <div class="items-grid">
        <div 
          v-for="lecture in lectures" 
          :key="lecture.number"
          class="glass-card item-card slide-up"
          :style="{ animationDelay: lecture.number * 0.02 + 's' }"
        >
          <div class="item-header">
            <span class="item-number">Lecture {{ lecture.number }}</span>
            <span :class="['status-badge', lecture.status]">{{ lecture.status }}</span>
          </div>
          <h3 class="item-title">{{ lecture.title }}</h3>
          <p class="item-date">{{ lecture.date }}</p>
          <p class="item-desc">{{ lecture.description || 'No description available' }}</p>
          <div class="item-links">
            <a v-if="lecture.slides_url" :href="lecture.slides_url" target="_blank" class="link-btn">
              📊 Slides
            </a>
            <a v-if="lecture.video_url" :href="lecture.video_url" target="_blank" class="link-btn">
              🎥 Video
            </a>
          </div>
          <div v-if="lecture.notes" class="item-notes">
            <strong>Notes:</strong> {{ lecture.notes }}
          </div>
        </div>
      </div>
    </div>

    <!-- Assignments Tab -->
    <div v-if="activeTab === 'assignments'" class="content-section">
      <div class="items-list">
        <div 
          v-for="assignment in assignments" 
          :key="assignment.number"
          class="glass-card assignment-card slide-up"
          :style="{ animationDelay: assignment.number * 0.05 + 's' }"
        >
          <div class="assignment-header">
            <div class="assignment-info">
              <span class="item-number">Assignment {{ assignment.number }}</span>
              <h3 class="item-title">{{ assignment.title }}</h3>
            </div>
            <span :class="['status-badge', assignment.status]">{{ assignment.status }}</span>
          </div>
          <div class="assignment-dates">
            <span v-if="assignment.out_date">📅 Out: {{ assignment.out_date }}</span>
            <span v-if="assignment.due_date">⏰ Due: {{ assignment.due_date }}</span>
          </div>
          <p class="item-desc">{{ assignment.description || 'No description available' }}</p>
          <div class="item-links">
            <a v-if="assignment.url" :href="assignment.url" target="_blank" class="link-btn">
              🔗 Assignment Link
            </a>
          </div>
          <div v-if="assignment.notes" class="item-notes">
            <strong>Notes:</strong> {{ assignment.notes }}
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Tab -->
    <div v-if="activeTab === 'notes'" class="content-section">
      <div class="glass-card notes-card slide-up">
        <h3>📓 Course Notes</h3>
        <div class="notes-content">
          <textarea 
            v-model="courseNotes" 
            placeholder="Write your course notes here..."
            @input="saveNotes"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const API_BASE = 'https://daxd.top:4433/api'

interface Lecture {
  number: number
  title: string
  date: string
  description: string
  slides_url: string
  video_url: string
  notes: string
  status: string
}

interface Assignment {
  number: number
  title: string
  out_date: string
  due_date: string
  description: string
  url: string
  notes: string
  status: string
}

const activeTab = ref('lectures')
const lectures = ref<Lecture[]>([])
const assignments = ref<Assignment[]>([])
const courseNotes = ref(localStorage.getItem('cs336-notes') || '')

const lectureProgress = computed(() => {
  return lectures.value.filter(l => l.status === 'completed').length
})

const assignmentProgress = computed(() => {
  return assignments.value.filter(a => a.status === 'completed').length
})

const fetchData = async () => {
  try {
    const [lecturesRes, assignmentsRes] = await Promise.all([
      fetch(`${API_BASE}/courses/lectures/`),
      fetch(`${API_BASE}/courses/assignments/`)
    ])
    lectures.value = await lecturesRes.json()
    assignments.value = await assignmentsRes.json()
  } catch (e) {
    console.error('Failed to fetch course data:', e)
  }
}

const saveNotes = () => {
  localStorage.setItem('cs336-notes', courseNotes.value)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.course-container {
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.course-header {
  text-align: center;
  margin-bottom: 40px;
}

.course-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 24px;
}

.progress-overview {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.progress-item .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.progress-item .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.tab {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
}

.tab:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tab.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.item-card, .assignment-card {
  padding: 20px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-number {
  font-size: 0.875rem;
  color: var(--accent-color);
  font-weight: 600;
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.status-badge.pending {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.status-badge.in_progress {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.item-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.item-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.item-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.item-links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.link-btn {
  padding: 6px 12px;
  background: rgba(124, 58, 237, 0.2);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--accent-color);
  text-decoration: none;
  transition: var(--transition);
}

.link-btn:hover {
  background: rgba(124, 58, 237, 0.3);
}

.item-notes {
  margin-top: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.assignment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.assignment-dates {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.notes-card {
  padding: 24px;
}

.notes-card h3 {
  margin-bottom: 16px;
}

.notes-content textarea {
  width: 100%;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 16px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.6;
  resize: vertical;
}

.notes-content textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

@media (max-width: 768px) {
  .course-header h1 {
    font-size: 1.75rem;
  }

  .progress-overview {
    gap: 16px;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>
