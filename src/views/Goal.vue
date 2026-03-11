<template>
  <div class="page-content">
    <h1 class="page-title slide-up">体重计划</h1>

    <!-- 未登录提示 -->
    <div v-if="!user" class="login-prompt slide-up glass-card">
      <p>🔒 请先登录后记录体重</p>
      <button class="btn" @click="goLogin">去登录</button>
    </div>

    <!-- 主内容 -->
    <div v-else class="goal-content">
      <!-- 添加记录 -->
      <div class="add-record slide-up glass-card" style="animation-delay: 0.1s">
        <h2>📝 添加记录</h2>
        <form @submit.prevent="addRecord" class="record-form">
          <div class="form-row">
            <div class="form-group">
              <label>日期</label>
              <input type="date" v-model="form.date" required />
            </div>
            <div class="form-group">
              <label>体重 (kg)</label>
              <input type="number" v-model="form.weight" step="0.1" placeholder="65.5" required />
            </div>
            <div class="form-group">
              <label>腰围 (cm)</label>
              <input type="number" v-model="form.waist" step="0.1" placeholder="75.0" />
            </div>
          </div>
          <div class="form-group">
            <label>备注</label>
            <input type="text" v-model="form.note" placeholder="今天运动了吗？" />
          </div>
          <button type="submit" class="btn" :disabled="isSubmitting">
            {{ isSubmitting ? '保存中...' : '保存记录' }}
          </button>
        </form>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section slide-up" style="animation-delay: 0.2s">
        <div class="chart-card glass-card">
          <h3>📈 体重变化</h3>
          <div class="chart-container" ref="weightChart"></div>
          <div v-if="records.length === 0" class="chart-empty">暂无数据</div>
        </div>
        <div class="chart-card glass-card">
          <h3>📏 腰围变化</h3>
          <div class="chart-container" ref="waistChart"></div>
          <div v-if="records.length === 0" class="chart-empty">暂无数据</div>
        </div>
      </div>

      <!-- 记录列表 -->
      <div class="records-section slide-up" style="animation-delay: 0.3s">
        <h2>📋 历史记录</h2>
        <div v-if="loading" class="loading-state">加载中...</div>
        <div v-else-if="records.length === 0" class="empty-state glass-card">
          暂无记录，开始记录你的体重吧！
        </div>
        <div v-else class="records-list">
          <div v-for="record in records" :key="record.id" class="record-item glass-card">
            <div class="record-date">{{ formatDate(record.date) }}</div>
            <div class="record-data">
              <div class="data-item">
                <span class="data-label">体重</span>
                <span class="data-value">{{ record.weight }} kg</span>
              </div>
              <div class="data-item" v-if="record.waist">
                <span class="data-label">腰围</span>
                <span class="data-value">{{ record.waist }} cm</span>
              </div>
            </div>
            <div class="record-note" v-if="record.note">{{ record.note }}</div>
            <button class="delete-btn" @click="deleteRecord(record.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

interface Record {
  id: string
  date: string
  weight: number
  waist: number | null
  note: string
  created_at: string
}

interface Form {
  date: string
  weight: string
  waist: string
  note: string
}

const API_BASE = 'https://daxd.top:4433/api'
const router = useRouter()

// 用户状态
const user = computed(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      return JSON.parse(savedUser)
    } catch (e) {
      return null
    }
  }
  return null
})

// 今天的日期
const today = new Date().toISOString().split('T')[0]

const form = ref<Form>({
  date: today,
  weight: '',
  waist: '',
  note: ''
})

const records = ref<Record[]>([])
const loading = ref(true)
const isSubmitting = ref(false)
const weightChart = ref<HTMLElement | null>(null)
const waistChart = ref<HTMLElement | null>(null)

const goLogin = () => {
  router.push('/')
}

// 获取记录
const fetchRecords = async () => {
  if (!user.value) return
  
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/goals/?github_id=${user.value.id}`)
    if (response.ok) {
      records.value = await response.json()
      await nextTick()
      renderCharts()
    }
  } catch (error) {
    console.error('Failed to fetch records:', error)
  } finally {
    loading.value = false
  }
}

// 添加记录
const addRecord = async () => {
  if (isSubmitting.value || !user.value) return

  isSubmitting.value = true
  try {
    const response = await fetch(`${API_BASE}/goals/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: form.value.date,
        weight: parseFloat(form.value.weight),
        waist: form.value.waist ? parseFloat(form.value.waist) : null,
        note: form.value.note,
        github_id: user.value.id,
        username: user.value.login
      })
    })

    if (response.ok) {
      form.value = { date: today, weight: '', waist: '', note: '' }
      await fetchRecords()
    } else {
      alert('保存失败，请重试')
    }
  } catch (error) {
    console.error('Failed to add record:', error)
    alert('保存失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 删除记录
const deleteRecord = async (id: string) => {
  if (!confirm('确定删除这条记录吗？')) return
  
  try {
    const response = await fetch(`${API_BASE}/goals/${id}/`, { method: 'DELETE' })
    if (response.ok) {
      await fetchRecords()
    }
  } catch (error) {
    console.error('Failed to delete record:', error)
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  })
}

// 渲染图表
const renderCharts = () => {
  if (records.value.length === 0) return

  const sortedRecords = [...records.value].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const dates = sortedRecords.map(r => r.date.slice(5)) // MM-DD
  const weights = sortedRecords.map(r => r.weight)
  const waists = sortedRecords.map(r => r.waist)

  // 体重图表
  if (weightChart.value) {
    const maxW = Math.max(...weights) + 2
    const minW = Math.min(...weights) - 2
    weightChart.value.innerHTML = `
      <svg viewBox="0 0 400 200" class="chart-svg">
        <defs>
          <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0" />
          </linearGradient>
        </defs>
        ${renderLine(dates, weights, minW, maxW, '#7c3aed', 'weightGradient')}
      </svg>
    `
  }

  // 腰围图表
  if (waistChart.value && waists.some(w => w !== null)) {
    const validWaists = waists.filter(w => w !== null) as number[]
    const maxW = Math.max(...validWaists) + 2
    const minW = Math.min(...validWaists) - 2
    waistChart.value.innerHTML = `
      <svg viewBox="0 0 400 200" class="chart-svg">
        <defs>
          <linearGradient id="waistGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0" />
          </linearGradient>
        </defs>
        ${renderLine(dates, waists.map(w => w || 0), minW, maxW, '#06b6d4', 'waistGradient', waists.map(w => w !== null))}
      </svg>
    `
  }
}

// 渲染折线
const renderLine = (
  labels: string[], 
  values: number[], 
  min: number, 
  max: number, 
  color: string,
  gradientId: string,
  visible?: boolean[]
) => {
  const width = 400
  const height = 200
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1 || 1)) * chartWidth
    const y = padding + chartHeight - ((v - min) / (max - min || 1)) * chartHeight
    return { x, y, v }
  })

  // 区域填充
  const areaPath = `M ${points[0].x} ${height - padding} ` +
    points.map(p => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x} ${height - padding} Z`

  // 折线
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  // 数据点
  const dots = points.map((p, i) => {
    if (visible && !visible[i]) return ''
    return `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" class="chart-dot"/>
            <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="var(--text-secondary)" font-size="10">${p.v}</text>`
  }).join('')

  // X轴标签
  const xLabels = labels.map((label, i) => {
    const x = padding + (i / (labels.length - 1 || 1)) * chartWidth
    return `<text x="${x}" y="${height - 15}" text-anchor="middle" fill="var(--text-secondary)" font-size="10">${label}</text>`
  }).join('')

  return `
    <path d="${areaPath}" fill="url(#${gradientId})" />
    <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2" class="chart-line"/>
    ${dots}
    ${xLabels}
  `
}

onMounted(() => {
  fetchRecords()
})
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

.login-prompt {
  max-width: 400px;
  margin: 0 auto;
  padding: 32px;
  text-align: center;
}

.login-prompt p {
  font-size: 1.125rem;
  margin-bottom: 20px;
  color: var(--text-secondary);
}

.goal-content {
  max-width: 900px;
  margin: 0 auto;
}

.add-record {
  margin-bottom: 32px;
  padding: 24px;
}

.add-record h2 {
  margin-bottom: 20px;
  font-size: 1.25rem;
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

input[type="date"],
input[type="number"],
input[type="text"] {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.btn {
  padding: 14px;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  padding: 24px;
}

.chart-card h3 {
  margin-bottom: 16px;
  font-size: 1rem;
  color: var(--text-secondary);
}

.chart-container {
  width: 100%;
  height: 200px;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  font-style: italic;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.chart-line {
  animation: drawLine 1s ease-out;
}

.chart-dot {
  animation: fadeIn 0.3s ease-out;
}

@keyframes drawLine {
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.records-section h2 {
  margin-bottom: 20px;
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-style: italic;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.record-date {
  font-weight: 600;
  color: var(--accent-color);
  min-width: 150px;
}

.record-data {
  display: flex;
  gap: 24px;
  flex: 1;
}

.data-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.data-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.data-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.record-note {
  flex-basis: 100%;
  padding-top: 12px;
  color: var(--text-secondary);
  font-style: italic;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.delete-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  color: #ef4444;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .record-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .record-data {
    width: 100%;
  }
}
</style>
