<template>
  <div class="callback-page">
    <div class="loading">
      <div class="spinner"></div>
      <p>Logging in...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const userB64 = route.query.user as string
  
  if (userB64) {
    try {
      // 解码用户信息
      const userJson = atob(userB64)
      const user = JSON.parse(userJson)
      
      // 保存到 localStorage
      localStorage.setItem('user', JSON.stringify(user))
      
      // 跳转到首页
      setTimeout(() => {
        router.push('/')
      }, 500)
    } catch (e) {
      console.error('Failed to parse user info:', e)
      router.push('/')
    }
  } else {
    // 没有 user 参数，跳转到首页
    router.push('/')
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
}
</style>
