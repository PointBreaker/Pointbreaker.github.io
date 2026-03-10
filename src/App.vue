<template>
  <div id="app">
    <ParticleBackground v-if="showBackground" />
    <nav class="nav" :class="{ 'nav-solid': !showBackground }">
      <router-link to="/" class="nav-logo">Hub</router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/cv" class="nav-link">CV</router-link>
        <router-link to="/links" class="nav-link">Links</router-link>
        <router-link to="/guestbook" class="nav-link">Guestbook</router-link>
        <router-link to="/gravity" class="nav-link">Gravity</router-link>
      </div>
    </nav>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import ParticleBackground from './components/ParticleBackground.vue'

const route = useRoute()

// Show particle background on all pages except Gravity
const showBackground = computed(() => route.path !== '/gravity')
</script>

<style>
#app {
  position: relative;
  min-height: 100vh;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-solid {
  background: rgba(10, 10, 15, 0.95);
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition);
  padding: 8px 12px;
  border-radius: 6px;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.router-link-active {
  color: var(--accent-color);
  background: rgba(124, 58, 237, 0.1);
}

/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }

  .nav-links {
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    font-size: 0.8125rem;
    padding: 6px 10px;
  }
}
</style>
