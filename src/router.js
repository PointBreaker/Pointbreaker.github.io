import { createRouter, createWebHashHistory } from 'vue-router'
import Hub from './views/Hub.vue'
import CV from './views/CV.vue'
import Links from './views/Links.vue'
import Index from './views/Index.vue'
import Gravity from './views/Gravity.vue'
import CryptoMarket from './views/CryptoMarket.vue'
import Guestbook from './views/Guestbook.vue'

const routes = [
  { path: '/', component: Hub },
  { path: '/cv', component: CV },
  { path: '/links', component: Links },
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
