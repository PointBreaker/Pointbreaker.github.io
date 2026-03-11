import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Hub from './views/Hub.vue'
import CV from './views/CV.vue'
import Links from './views/Links.vue'
import Guestbook from './views/Guestbook.vue'
import Gravity from './views/Gravity.vue'
import Callback from './views/Callback.vue'
import Goal from './views/Goal.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Hub', component: Hub },
  { path: '/cv', name: 'CV', component: CV },
  { path: '/links', name: 'Links', component: Links },
  { path: '/guestbook', name: 'Guestbook', component: Guestbook },
  { path: '/gravity', name: 'Gravity', component: Gravity },
  { path: '/callback', name: 'Callback', component: Callback },
  { path: '/goal', name: 'Goal', component: Goal },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
