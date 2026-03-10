<script setup>
import { ref, onMounted, computed } from 'vue'

const API_BASE = 'http://120.77.151.207:8000/api'

const messages = ref([])
const nickname = ref('')
const content = ref('')
const loading = ref(false)
const submitting = ref(false)
const visitorInfo = ref(null)
const error = ref('')

// 获取访客信息
const fetchVisitorInfo = async () => {
  try {
    const res = await fetch(`${API_BASE}/messages/visitor_info/`, {
      credentials: 'include'
    })
    visitorInfo.value = await res.json()
  } catch (e) {
    console.error('获取访客信息失败:', e)
  }
}

// 获取所有留言
const fetchMessages = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/messages/`, {
      credentials: 'include'
    })
    messages.value = await res.json()
  } catch (e) {
    error.value = '加载留言失败，请稍后重试'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 提交留言
const submitMessage = async () => {
  if (!content.value.trim()) return
  
  submitting.value = true
  error.value = ''
  
  try {
    const res = await fetch(`${API_BASE}/messages/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        nickname: nickname.value.trim() || '匿名',
        content: content.value.trim()
      })
    })
    
    if (res.ok) {
      content.value = ''
      await fetchMessages()
      await fetchVisitorInfo()
    } else {
      error.value = '发送失败，请稍后重试'
    }
  } catch (e) {
    error.value = '网络错误，请稍后重试'
    console.error(e)
  } finally {
    submitting.value = false
  }
}

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 留言数量统计
const messageCount = computed(() => messages.value.length)

onMounted(() => {
  fetchMessages()
  fetchVisitorInfo()
})
</script>

<template>
  <div class="page">
    <nav class="nav">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">dax</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/guestbook" class="nav-link active">Guestbook</router-link>
          <router-link to="/index" class="nav-link">Index</router-link>
        </div>
      </div>
    </nav>

    <main class="main">
      <div class="container">
        <header class="header">
          <h1 class="title">💬 留言板</h1>
          <p class="subtitle">
            共 {{ messageCount }} 条留言
            <span v-if="visitorInfo?.has_cookie" class="visitor-badge">
              · 你的 ID: {{ visitorInfo.visitor_id?.slice(0, 8) }}...
            </span>
          </p>
        </header>

        <!-- 发送表单 -->
        <div class="compose-card">
          <div class="form-row">
            <input
              v-model="nickname"
              type="text"
              placeholder="昵称（可选）"
              class="input nickname-input"
              maxlength="20"
            />
          </div>
          <textarea
            v-model="content"
            placeholder="说点什么..."
            class="input textarea"
            maxlength="500"
            rows="3"
          ></textarea>
          <div class="form-footer">
            <span class="char-count">{{ content.length }}/500</span>
            <button
              @click="submitMessage"
              :disabled="!content.trim() || submitting"
              class="btn-primary"
            >
              {{ submitting ? '发送中...' : '发送' }}
            </button>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-msg">
          {{ error }}
        </div>

        <!-- 留言列表 -->
        <div class="messages">
          <div v-if="loading" class="loading">加载中...</div>
          
          <div v-else-if="messages.length === 0" class="empty">
            还没有留言，来发第一条吧！
          </div>
          
          <div v-else>
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-card"
            >
              <div class="message-header">
                <span class="message-nickname">{{ msg.nickname }}</span>
                <span class="message-time">{{ formatTime(msg.created_at) }}</span>
              </div>
              <p class="message-content">{{ msg.content }}</p>
              <div class="message-id">ID: {{ msg.id.toString().slice(0, 8) }}...</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg);
}

.main {
  padding-top: 80px;
  padding-bottom: 60px;
}

.container {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.header {
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.visitor-badge {
  color: var(--accent);
  font-family: monospace;
}

/* 发送表单 */
.compose-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.form-row {
  margin-bottom: 0.75rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: var(--bg);
  color: var(--text);
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.nickname-input {
  max-width: 200px;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

.char-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-primary {
  padding: 0.625rem 1.5rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-light);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 错误提示 */
.error-msg {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

/* 留言列表 */
.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading, .empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.message-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  transition: box-shadow 0.2s;
}

.message-card:hover {
  box-shadow: var(--shadow);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.message-nickname {
  font-weight: 600;
  color: var(--text);
}

.message-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.message-content {
  color: var(--text);
  font-size: 0.9375rem;
  line-height: 1.6;
  word-break: break-word;
}

.message-id {
  margin-top: 0.5rem;
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-family: monospace;
  opacity: 0.6;
}

/* 响应式 */
@media (max-width: 640px) {
  .container {
    padding: 1.5rem 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style>
