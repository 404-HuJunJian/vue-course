import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/hardware',
    name: 'hardware',
    component: () => import('@/views/HardwareView.vue')
  },
  {
    path: '/server',
    name: 'server',
    component: () => import('@/views/ServerView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
