<script setup>
import { ref, onMounted, computed } from 'vue'

const API_BASE = 'https://daxd.top:4433/api'

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
    <!-- 动态背景效果 -->
    <div class="bg-noise"></div>
    <div class="bg-gradient"></div>
    
    <!-- 装饰性浮动粒子 -->
    <div class="floating-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
    </div>

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

        <!-- 发送表单 - 玻璃态效果 -->
        <div class="compose-card glass-card">
          <div class="compose-glow"></div>
          <div class="form-row">
            <input
              v-model="nickname"
              type="text"
              placeholder="昵称（可选）"
              class="input nickname-input"
              maxlength="20"
            />
          </div>
          <div class="textarea-wrapper">
            <textarea
              v-model="content"
              placeholder="说点什么..."
              class="input textarea"
              maxlength="500"
              rows="3"
            ></textarea>
            <div class="cursor-blink" v-if="!content.length"></div>
          </div>
          <div class="form-footer">
            <span class="char-count">{{ content.length }}/500</span>
            <button
              @click="submitMessage"
              :disabled="!content.trim() || submitting"
              class="btn-primary btn-glow"
            >
              <span class="btn-ripple"></span>
              <span class="btn-text">{{ submitting ? '发送中...' : '发送' }}</span>
            </button>
          </div>
        </div>

        <!-- 错误提示 - 抖动动画 -->
        <transition name="error-shake">
          <div v-if="error" class="error-msg">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>
        </transition>

        <!-- 留言列表 -->
        <div class="messages">
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>
          
          <div v-else-if="messages.length === 0" class="empty">
            <span class="empty-icon">✨</span>
            还没有留言，来发第一条吧！
          </div>
          
          <transition-group v-else name="message-list" tag="div" class="message-list">
            <div
              v-for="(msg, index) in messages"
              :key="msg.id"
              class="message-card gradient-border-card"
              :style="{ '--delay': index * 0.05 + 's' }"
            >
              <div class="card-border"></div>
              <div class="card-content">
                <div class="message-header">
                  <span class="message-nickname">{{ msg.nickname }}</span>
                  <span class="message-time">{{ formatTime(msg.created_at) }}</span>
                </div>
                <p class="message-content">{{ msg.content }}</p>
                <div class="message-id">ID: {{ msg.id.toString().slice(0, 8) }}...</div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* === 基础样式 === */
.page {
  min-height: 100vh;
  background: var(--bg);
  position: relative;
  overflow-x: hidden;
}

/* === 动态背景效果 === */
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

/* === 浮动粒子效果 === */
.floating-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  opacity: 0.15;
  animation: float-particle 20s infinite ease-in-out;
}

.particle-1 {
  left: 10%;
  top: 20%;
  animation-delay: 0s;
  animation-duration: 25s;
}

.particle-2 {
  left: 80%;
  top: 30%;
  animation-delay: -5s;
  animation-duration: 20s;
  width: 6px;
  height: 6px;
}

.particle-3 {
  left: 30%;
  top: 70%;
  animation-delay: -10s;
  animation-duration: 22s;
}

.particle-4 {
  left: 70%;
  top: 80%;
  animation-delay: -15s;
  animation-duration: 18s;
  width: 5px;
  height: 5px;
}

.particle-5 {
  left: 50%;
  top: 50%;
  animation-delay: -8s;
  animation-duration: 24s;
  width: 3px;
  height: 3px;
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.15;
  }
  25% {
    transform: translate(30px, -40px) scale(1.2);
    opacity: 0.25;
  }
  50% {
    transform: translate(-20px, -80px) scale(0.8);
    opacity: 0.1;
  }
  75% {
    transform: translate(40px, -40px) scale(1.1);
    opacity: 0.2;
  }
}

.main {
  position: relative;
  z-index: 1;
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
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.visitor-badge {
  color: var(--accent);
  font-family: monospace;
}

/* === 玻璃态发送表单 === */
.compose-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
  animation: fadeInUp 0.6s ease 0.1s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.compose-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%);
  pointer-events: none;
  animation: glow-rotate 15s linear infinite;
}

@keyframes glow-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.form-row {
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15),
              0 0 20px rgba(99, 102, 241, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.input::placeholder {
  color: var(--text-muted);
}

.nickname-input {
  max-width: 200px;
}

/* === 打字机光标动画 === */
.textarea-wrapper {
  position: relative;
  z-index: 1;
}

.textarea {
  resize: vertical;
  min-height: 80px;
  position: relative;
}

.cursor-blink {
  position: absolute;
  left: 1rem;
  top: 1rem;
  width: 2px;
  height: 1.2em;
  background: var(--accent);
  animation: cursor-blink 1s step-end infinite;
  pointer-events: none;
  opacity: 0.6;
}

@keyframes cursor-blink {
  0%, 50% {
    opacity: 0.6;
  }
  51%, 100% {
    opacity: 0;
  }
}

.textarea:focus ~ .cursor-blink {
  display: none;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  position: relative;
  z-index: 1;
}

.char-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* === 发光按钮 + 波纹效果 === */
.btn-primary {
  position: relative;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, var(--accent) 0%, #818cf8 100%);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(99, 102, 241, 0.4),
              0 0 40px rgba(99, 102, 241, 0.2);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-ripple {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), 
              rgba(255, 255, 255, 0.3) 0%, 
              transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-primary:active .btn-ripple {
  opacity: 1;
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.btn-text {
  position: relative;
  z-index: 1;
}

/* === 错误提示 - 抖动动画 === */
.error-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: rgba(239, 68, 68, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-sm);
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  animation: error-shake 0.5s ease;
}

.error-icon {
  font-size: 1rem;
}

.error-shake-enter-active {
  animation: error-shake 0.5s ease;
}

.error-shake-leave-active {
  transition: all 0.3s ease;
}

.error-shake-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes error-shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

/* === 留言列表 === */
.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* === 留言卡片 - 渐变边框 + 悬浮动画 === */
.message-card {
  position: relative;
  border-radius: var(--radius);
  animation: fadeInUp 0.5s ease both;
  animation-delay: var(--delay);
  transition: transform 0.3s ease;
}

.message-card:hover {
  transform: translateY(-4px);
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  padding: 1px;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.5) 0%, 
    rgba(139, 92, 246, 0.3) 50%,
    rgba(99, 102, 241, 0.1) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, 
                 linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.message-card:hover .card-border {
  opacity: 1;
  animation: border-glow 2s ease-in-out infinite;
}

@keyframes border-glow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.card-content {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: var(--radius);
  padding: 1.25rem;
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
  background: linear-gradient(135deg, var(--text) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  margin-bottom: 0.5rem;
}

.message-id {
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-family: monospace;
  opacity: 0.5;
}

/* === 列表动画 === */
.message-list-enter-active {
  animation: fadeInUp 0.5s ease;
}

.message-list-leave-active {
  animation: fadeOutDown 0.3s ease;
}

.message-list-move {
  transition: transform 0.3s ease;
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* === 响应式设计 === */
@media (max-width: 640px) {
  .container {
    padding: 1.5rem 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .compose-card {
    padding: 1.25rem;
  }
  
  .nickname-input {
    max-width: 100%;
  }
  
  .btn-primary {
    padding: 0.625rem 1.5rem;
  }
  
  .particle {
    display: none;
  }
}
</style>
