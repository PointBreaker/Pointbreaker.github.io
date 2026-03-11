<template>
  <div class="page-content">
    <h1 class="page-title slide-up">Guestbook</h1>

    <!-- 未登录提示 -->
    <div v-if="!user" class="login-prompt slide-up glass-card" style="animation-delay: 0.1s">
      <p>🔒 请先登录后再留言</p>
      <button class="btn" @click="goLogin">去登录</button>
    </div>

    <!-- 留言表单 -->
    <div v-else class="form-section slide-up" style="animation-delay: 0.1s">
      <div class="glass-card">
        <div class="user-info-header">
          <img :src="user.avatar_url" :alt="user.login" class="user-avatar" />
          <div class="user-details">
            <span class="user-name">{{ user.login }}</span>
            <span class="user-id">ID: {{ user.id }}</span>
          </div>
        </div>
        <form @submit.prevent="submitMessage" class="guestbook-form">
          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>
          <button type="submit" class="btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>
    </div>

    <!-- 留言列表 -->
    <div class="messages-section slide-up" style="animation-delay: 0.2s">
      <h2 class="section-title">Messages</h2>
      <div v-if="loading" class="loading-state">Loading messages...</div>
      <div v-else-if="messages.length === 0" class="empty-state">No messages yet. Be the first!</div>
      <div v-else class="messages-list">
        <div v-for="message in messages" :key="message.id" class="message-card glass-card">
          <div class="message-header">
            <div class="message-author-info">
              <img 
                v-if="message.avatar_url" 
                :src="message.avatar_url" 
                :alt="message.username" 
                class="message-avatar" 
              />
              <div class="message-author-default" v-else>
                {{ message.username?.charAt(0).toUpperCase() || '?' }}
              </div>
              <div class="message-author-details">
                <span class="message-author">{{ message.username || 'Anonymous' }}</span>
                <span class="message-github-id" v-if="message.github_id">GitHub: {{ message.github_id }}</span>
              </div>
            </div>
            <span class="message-date">{{ formatDate(message.created_at) }}</span>
          </div>
          <p class="message-content">{{ message.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Message {
  id: string
  username: string
  github_id: number
  avatar_url: string
  content: string
  created_at: string
}

interface Form {
  message: string
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

const form = ref<Form>({
  message: ''
})

const messages = ref<Message[]>([])
const loading = ref(true)
const isSubmitting = ref(false)

const goLogin = () => {
  router.push('/')
}

const fetchMessages = async () => {
  try {
    const response = await fetch(`${API_BASE}/messages/`)
    if (response.ok) {
      const data = await response.json()
      messages.value = data || []
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  } finally {
    loading.value = false
  }
}

const submitMessage = async () => {
  if (isSubmitting.value || !user.value) return

  isSubmitting.value = true
  try {
    const response = await fetch(`${API_BASE}/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: form.value.message,
        username: user.value.login,
        github_id: user.value.id,
        avatar_url: user.value.avatar_url
      })
    })

    if (response.ok) {
      form.value = { message: '' }
      await fetchMessages()
    } else {
      alert('Failed to send message. Please try again.')
    }
  } catch (error) {
    console.error('Failed to submit message:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchMessages()
})
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

.login-prompt {
  max-width: 400px;
  margin: 0 auto 48px;
  padding: 32px;
  text-align: center;
}

.login-prompt p {
  font-size: 1.125rem;
  margin-bottom: 20px;
  color: var(--text-secondary);
}

.form-section {
  margin-bottom: 48px;
}

.form-section .glass-card {
  max-width: 600px;
  margin: 0 auto;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.user-id {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.guestbook-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

textarea::placeholder {
  color: var(--text-secondary);
}

.btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
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

.messages-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: var(--text-secondary);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-style: italic;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-card {
  margin-bottom: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.message-author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(124, 58, 237, 0.3);
}

.message-author-default {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1.125rem;
}

.message-author-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.message-author {
  font-weight: 600;
  color: var(--accent-color);
  font-size: 1rem;
}

.message-github-id {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.message-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.message-content {
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding-left: 52px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .form-section .glass-card {
    padding: 20px;
  }

  .message-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .message-content {
    padding-left: 0;
    margin-top: 8px;
  }
}
</style>
