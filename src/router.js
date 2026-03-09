import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Index from './views/Index.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/index', component: Index }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
