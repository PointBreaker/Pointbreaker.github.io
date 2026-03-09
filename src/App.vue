<script setup>
import { ref, onMounted } from 'vue'

const particles = ref([])
const statusText = 'Open to collaboration'

onMounted(() => {
  // 创建漂浮粒子
  for (let i = 0; i < 30; i++) {
    particles.value.push({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 10 + 's',
      duration: (8 + Math.random() * 8) + 's'
    })
  }
})
</script>

<template>
  <div class="app">
    <!-- Background -->
    <div class="bg-grid"></div>
    <div class="glow-orb glow-orb-1"></div>
    <div class="glow-orb glow-orb-2"></div>
    
    <!-- Particles -->
    <div class="particles">
      <div 
        v-for="p in particles" 
        :key="p.id"
        class="particle"
        :style="{
          left: p.left,
          animationDelay: p.delay,
          animationDuration: p.duration
        }"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <div class="avatar">🧑‍💻</div>
      <h1>PointBreaker</h1>
      <p class="subtitle">
        Building the future, one commit at a time.
        <br>Developer • Creator • Explorer
      </p>
      
      <div class="status">
        <div class="status-dot"></div>
        <span>{{ statusText }}</span>
      </div>

      <div class="links">
        <a href="https://github.com/PointBreaker" target="_blank" class="link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
    </div>

    <div class="footer">
      Powered by <span>Claw</span> + <span>Vue</span> • 2026
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-dark: #0a0a0f;
  --accent: #7c3aed;
  --accent-light: #a78bfa;
  --text: #e2e8f0;
  --text-dim: #94a3b8;
}

.app {
  min-height: 100vh;
  background: var(--bg-dark);
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text);
  overflow-x: hidden;
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(124, 58, 237, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124, 58, 237, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: -1;
}

.glow-orb {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  z-index: -1;
  animation: float 20s ease-in-out infinite;
}

.glow-orb-1 {
  background: var(--accent);
  top: -200px;
  right: -200px;
}

.glow-orb-2 {
  background: #06b6d4;
  bottom: -200px;
  left: -200px;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-50px, 50px); }
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 60px rgba(124, 58, 237, 0.4);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 60px rgba(124, 58, 237, 0.4); }
  50% { box-shadow: 0 0 80px rgba(124, 58, 237, 0.6); }
}

h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text), var(--accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-dim);
  margin-bottom: 3rem;
  max-width: 500px;
  line-height: 1.8;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 100px;
  margin-bottom: 3rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: var(--text);
  text-decoration: none;
  transition: all 0.3s ease;
}

.link:hover {
  background: rgba(124, 58, 237, 0.2);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.footer {
  position: fixed;
  bottom: 2rem;
  color: var(--text-dim);
  font-size: 0.875rem;
}

.footer span {
  color: var(--accent-light);
}

.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  opacity: 0.5;
  animation: rise 10s linear infinite;
}

@keyframes rise {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}
</style>
