<template>
  <div class="page-content">
    <h1 class="page-title slide-up">Guestbook</h1>

    <!-- 留言表单 -->
    <div class="form-section slide-up" style="animation-delay: 0.1s">
      <div class="glass-card">
        <h2>Leave a Message</h2>
        <form @submit.prevent="submitMessage" class="guestbook-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Your name"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email (optional)</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
            />
          </div>
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
            <span class="message-author">{{ message.name }}</span>
            <span class="message-date">{{ formatDate(message.created_at) }}</span>
          </div>
          <p class="message-content">{{ message.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Message {
  id: number
  name: string
  email?: string
  message: string
  created_at: string
}

interface Form {
  name: string
  email: string
  message: string
}

const API_BASE = 'https://daxd.top:4433/api'

const form = ref<Form>({
  name: '',
  email: '',
  message: ''
})

const messages = ref<Message[]>([])
const loading = ref(true)
const isSubmitting = ref(false)

const fetchMessages = async () => {
  try {
    const response = await fetch(`${API_BASE}/messages`)
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
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email || undefined,
        message: form.value.message
      })
    })

    if (response.ok) {
      // Clear form
      form.value = { name: '', email: '', message: '' }
      // Refresh messages
      await fetchMessages()
      alert('Message sent successfully!')
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
  return date.toLocaleDateString('en-US', {
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

.form-section {
  margin-bottom: 48px;
}

.form-section .glass-card {
  max-width: 600px;
  margin: 0 auto;
}

.form-section h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.5rem;
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

.btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.message-author {
  font-weight: 600;
  color: var(--accent-color);
  font-size: 1rem;
}

.message-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.message-content {
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
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
}
</style>
