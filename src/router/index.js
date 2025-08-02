import { createRouter, createWebHistory } from 'vue-router'

// 配置路由规则
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/User/userLogin.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/User/userRegister.vue')
  },
  {
    path: '/homePage',
    name: 'homePage',
    component: () => import('../views/Home/homePage.vue'),
    children: [
      {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/User/userSetting.vue'),
      },
      {
        path: '/userChat',
        name: 'userChat',
        component: () => import('../views/User/userChat.vue'),
      },
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('../views/User/userInfo.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
