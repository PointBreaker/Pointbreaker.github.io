import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',  // 相对路径，支持子目录部署
  build: {
    outDir: 'dist'
  }
})
