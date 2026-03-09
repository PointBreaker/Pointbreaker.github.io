import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Daily from './views/Daily.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/daily', component: Daily }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
