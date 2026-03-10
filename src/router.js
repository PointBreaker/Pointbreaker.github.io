import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Index from './views/Index.vue'
import Gravity from './views/Gravity.vue'
import CryptoMarket from './views/CryptoMarket.vue'
import Guestbook from './views/Guestbook.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/index', component: Index },
  { path: '/gravity', component: Gravity },
  { path: '/crypto', component: CryptoMarket },
  { path: '/guestbook', component: Guestbook }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
