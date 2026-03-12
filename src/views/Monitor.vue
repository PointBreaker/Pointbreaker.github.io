<template>
  <div class="monitor-container">
    <div class="monitor-header slide-up">
      <h1>Server Monitor</h1>
      <p class="subtitle">Real-time status for Local & Aliyun servers</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading server data...</p>
    </div>

    <div v-else class="machines-wrapper">
      <!-- Local Machine -->
      <div class="machine-section slide-up" style="animation-delay: 0.1s">
        <div class="machine-header">
          <h2>🖥️ Local Machine</h2>
          <span class="machine-badge">Home</span>
        </div>
        <div class="machine-grid">
          <!-- CPU -->
          <div class="glass-card metric-card">
            <div class="card-header">
              <h3>CPU</h3>
              <span class="metric-value">{{ localData?.cpu.percent.toFixed(1) }}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar cpu-bar" :style="{ width: localData?.cpu.percent + '%' }"></div>
            </div>
            <div class="metric-details">
              <div class="detail-item">
                <span class="label">Cores</span>
                <span class="value">{{ localData?.cpu.count }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Freq</span>
                <span class="value">{{ localData?.cpu.freq_mhz.toFixed(0) }} MHz</span>
              </div>
            </div>
          </div>

          <!-- Memory -->
          <div class="glass-card metric-card">
            <div class="card-header">
              <h3>Memory</h3>
              <span class="metric-value">{{ localData?.memory.percent.toFixed(1) }}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar memory-bar" :style="{ width: localData?.memory.percent + '%' }"></div>
            </div>
            <div class="metric-details">
              <div class="detail-item">
                <span class="label">Used</span>
                <span class="value">{{ localData?.memory.used_gb.toFixed(2) }} GB</span>
              </div>
              <div class="detail-item">
                <span class="label">Total</span>
                <span class="value">{{ localData?.memory.total_gb.toFixed(2) }} GB</span>
              </div>
            </div>
          </div>

          <!-- Disk -->
          <div class="glass-card metric-card">
            <div class="card-header">
              <h3>Disk</h3>
              <span class="metric-value">{{ localData?.disk.percent.toFixed(1) }}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar disk-bar" :style="{ width: localData?.disk.percent + '%' }"></div>
            </div>
            <div class="metric-details">
              <div class="detail-item">
                <span class="label">Used</span>
                <span class="value">{{ localData?.disk.used_gb.toFixed(2) }} GB</span>
              </div>
              <div class="detail-item">
                <span class="label">Total</span>
                <span class="value">{{ localData?.disk.total_gb.toFixed(2) }} GB</span>
              </div>
            </div>
          </div>

          <!-- System Info -->
          <div class="glass-card info-card">
            <div class="card-header">
              <h3>System</h3>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Platform</span>
                <span class="info-value">{{ localData?.system.platform }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Hostname</span>
                <span class="info-value">{{ localData?.system.hostname }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Uptime</span>
                <span class="info-value">{{ localData?.system.uptime_days }} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aliyun Server -->
      <div class="machine-section slide-up" style="animation-delay: 0.2s">
        <div class="machine-header">
          <h2>☁️ Aliyun Server</h2>
          <span class="machine-badge cloud">Cloud</span>
        </div>
        <div class="machine-grid">
          <!-- CPU -->
          <div class="glass-card metric-card">
            <div class="card-header">
              <h3>CPU</h3>
              <span class="metric-value">{{ serverData?.cpu.percent.toFixed(1) }}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar cpu-bar" :style="{ width: serverData?.cpu.percent + '%' }"></div>
            </div>
            <div class="metric-details">
              <div class="detail-item">
                <span class="label">Cores</span>
                <span class="value">{{ serverData?.cpu.count }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Freq</span>
                <span class="value">{{ serverData?.cpu.freq_mhz.toFixed(0) }} MHz</span>
              </div>
            </div>
          </div>

          <!-- Memory -->
          <div class="glass-card metric-card">
            <div class="card-header">
              <h3>Memory</h3>
              <span class="metric-value">{{ serverData?.memory.percent.toFixed(1) }}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar memory-bar" :style="{ width: serverData?.memory.percent + '%' }"></div>
            </div>
            <div class="metric-details">
              <div class="detail-item">
                <span class="label">Used</span>
                <span class="value">{{ serverData?.memory.used_gb.toFixed(2) }} GB</span>
              </div>
              <div class="detail-item">
                <span class="label">Total</span>
                <span class="value">{{ serverData?.memory.total_gb.toFixed(2) }} GB</span>
              </div>
            </div>
          </div>

          <!-- Disk -->
          <div class="glass-card metric-card">
            <div class="card-header">
              <h3>Disk</h3>
              <span class="metric-value">{{ serverData?.disk.percent.toFixed(1) }}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar disk-bar" :style="{ width: serverData?.disk.percent + '%' }"></div>
            </div>
            <div class="metric-details">
              <div class="detail-item">
                <span class="label">Used</span>
                <span class="value">{{ serverData?.disk.used_gb.toFixed(2) }} GB</span>
              </div>
              <div class="detail-item">
                <span class="label">Total</span>
                <span class="value">{{ serverData?.disk.total_gb.toFixed(2) }} GB</span>
              </div>
            </div>
          </div>

          <!-- System Info -->
          <div class="glass-card info-card">
            <div class="card-header">
              <h3>System</h3>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Platform</span>
                <span class="info-value">{{ serverData?.system.platform }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Hostname</span>
                <span class="info-value">{{ serverData?.system.hostname }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Uptime</span>
                <span class="info-value">{{ serverData?.system.uptime_days }} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Services (Shared) -->
      <div class="glass-card services-card slide-up" style="animation-delay: 0.3s">
        <div class="card-header">
          <h3>🔧 Services</h3>
          <span class="refresh-hint">Auto-refresh: 10s</span>
        </div>
        <div class="services-list">
          <div class="service-item" :class="{ active: services?.django }">
            <span class="service-status">{{ services?.django ? '✅' : '❌' }}</span>
            <span class="service-name">Django</span>
          </div>
          <div class="service-item" :class="{ active: services?.nginx }">
            <span class="service-status">{{ services?.nginx ? '✅' : '❌' }}</span>
            <span class="service-name">Nginx</span>
          </div>
          <div class="service-item" :class="{ active: services?.mysql }">
            <span class="service-status">{{ services?.mysql ? '✅' : '❌' }}</span>
            <span class="service-name">MySQL</span>
          </div>
        </div>
      </div>
    </div>

    <div class="last-update slide-up" style="animation-delay: 0.4s">
      <span>Last updated: {{ lastUpdate }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface MachineData {
  cpu: {
    percent: number
    count: number
    freq_mhz: number
  }
  memory: {
    total_gb: number
    used_gb: number
    percent: number
  }
  disk: {
    total_gb: number
    used_gb: number
    percent: number
  }
  system: {
    platform: string
    hostname: string
    uptime_days: number
  }
}

interface Services {
  django: boolean
  nginx: boolean
  mysql: boolean
}

const API_BASE = 'https://daxd.top:4433/api'

const localData = ref<MachineData | null>(null)
const serverData = ref<MachineData | null>(null)
const services = ref<Services | null>(null)
const loading = ref(true)
const lastUpdate = ref('')
const refreshInterval = ref<number | null>(null)

const fetchLocalData = async () => {
  try {
    const response = await fetch(`${API_BASE}/monitor/local/status/`)
    localData.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch local data:', error)
  }
}

const fetchServerData = async () => {
  try {
    const response = await fetch(`${API_BASE}/monitor/server/`)
    serverData.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch server data:', error)
  }
}

const fetchServices = async () => {
  try {
    const response = await fetch(`${API_BASE}/monitor/services/`)
    services.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch services:', error)
  }
}

const fetchAll = async () => {
  await Promise.all([fetchLocalData(), fetchServerData(), fetchServices()])
  lastUpdate.value = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  loading.value = false
}

onMounted(() => {
  fetchAll()
  refreshInterval.value = setInterval(fetchAll, 10000) as unknown as number
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
.monitor-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}

.monitor-header {
  text-align: center;
  margin-bottom: 40px;
}

.monitor-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(124, 58, 237, 0.2);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: var(--text-secondary);
}

.machines-wrapper {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
}

.machine-section {
  width: 100%;
}

.machine-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.machine-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.machine-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(124, 58, 237, 0.2);
  color: #a78bfa;
  border: 1px solid rgba(124, 58, 237, 0.3);
}

.machine-badge.cloud {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.machine-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 600;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color);
}

.progress-container {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-bar {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.cpu-bar {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

.memory-bar {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.disk-bar {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

.metric-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
}

.detail-item .label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.detail-item .value {
  font-weight: 600;
  font-size: 0.8rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  border: 1px solid var(--glass-border);
}

.info-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.info-value {
  font-weight: 500;
  font-size: 0.8rem;
}

.services-card {
  margin-top: 20px;
}

.refresh-hint {
  font-size: 0.7rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  transition: var(--transition);
  flex: 1;
  min-width: 150px;
}

.service-item.active {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}

.service-status {
  font-size: 1.1rem;
}

.service-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.last-update {
  margin-top: 32px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .monitor-header h1 {
    font-size: 2rem;
  }

  .machine-grid {
    grid-template-columns: 1fr;
  }

  .metric-details {
    grid-template-columns: 1fr;
  }

  .services-list {
    flex-direction: column;
  }

  .service-item {
    min-width: 100%;
  }
}
</style>
