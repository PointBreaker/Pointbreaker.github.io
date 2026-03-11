<template>
  <div class="callback-page">
    <div class="loading">
      <div class="spinner"></div>
      <p>{{ status }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const status = ref('Logging in...')

onMounted(() => {
  // 解析 URL 参数（hash 模式下用 window.location）
  const hash = window.location.hash // #/callback?user=xxx
  const queryStart = hash.indexOf('?')
  
  if (queryStart === -1) {
    status.value = 'No user data found'
    setTimeout(() => router.push('/'), 1500)
    return
  }
  
  const queryString = hash.substring(queryStart + 1)
  const params = new URLSearchParams(queryString)
  const userB64 = params.get('user')
  
  if (!userB64) {
    status.value = 'No user data'
    setTimeout(() => router.push('/'), 1500)
    return
  }
  
  try {
    // Base64 解码
    const userJson = atob(userB64)
    const user = JSON.parse(userJson)
    
    // 保存到 localStorage
    localStorage.setItem('user', JSON.stringify(user))
    
    status.value = `Welcome, ${user.login}!`
    
    // 跳转到首页
    setTimeout(() => {
      window.location.href = '/#/'
    }, 1000)
  } catch (e) {
    console.error('Failed to parse user info:', e)
    status.value = 'Login failed'
    setTimeout(() => router.push('/'), 1500)
  }
})
</script>

<style scoped>
.callback-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(124, 58, 237, 0.3);
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

p {
  color: var(--text-secondary);
  font-size: 1rem;
}
</style>
