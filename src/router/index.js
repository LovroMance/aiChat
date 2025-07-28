import { createRouter, createWebHistory } from 'vue-router'

// 配置路由规则
const routes = [
    {
    path: '/login',
    name: 'login',
    component: () => import('../views/User/userLogin.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home/homePage.vue')
  },
  {

  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
