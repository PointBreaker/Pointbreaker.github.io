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
  --bg: #0a0a0f;
  --bg-card: #1a1a2e;
  --text: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.4);
  --accent: #6366f1;
  --accent-light: #818cf8;
  --border: rgba(255, 255, 255, 0.08);
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 40px rgba(99, 102, 241, 0.15);
  --radius: 12px;
  --radius-sm: 6px;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text);
  line-height: 1.6;
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 选择文本样式 */
::selection {
  background: rgba(99, 102, 241, 0.3);
  color: #fff;
}
</style>
