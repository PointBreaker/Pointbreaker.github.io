<script setup>
</script>

<template>
  <router-view />
</template>

<style>
/* === Global Reset & Variables === */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #fafafa;
  --bg-card: #ffffff;
  --text: #1a1a2e;
  --text-secondary: #64648c;
  --text-muted: #9494b8;
  --accent: #6366f1;
  --accent-light: #818cf8;
  --border: #e5e5e5;
  --shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.08);
  --radius: 12px;
  --radius-sm: 6px;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text);
  line-height: 1.6;
  background: var(--bg);
}

a {
  color: inherit;
  text-decoration: none;
}

/* 共享样式：导航栏 */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.nav-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--text);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--text);
  background: rgba(0,0,0,0.04);
}

.nav-link.active {
  color: var(--accent);
  background: rgba(99, 102, 241, 0.1);
}

/* 响应式 */
@media (max-width: 640px) {
  .nav-inner {
    padding: 0.875rem 1rem;
  }
  
  .nav-links {
    gap: 0;
  }
  
  .nav-link {
    padding: 0.5rem 0.625rem;
    font-size: 0.8125rem;
  }
}
</style>
