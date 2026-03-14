import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import pinia from '@/stores'
import { USER_LOGIN_INFO, getStorage } from '@/utils/localstorage'
import { closeWebSocket } from '@/utils/websocket'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/authentication/login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/authentication/register.vue'),
    meta: { title: '注册' },
  },
  {
    path: '/user-home',
    name: 'userHome',
    component: () => import('@/views/home/user-home.vue'),
    meta: { title: '个人主页', requiresAuth: true },
    alias: ['/userHome'],
  },
  {
    path: '/home-layout',
    name: 'HomeLayout',
    component: () => import('@/layout/home-layout.vue'),
    meta: { requiresAuth: true },
    alias: ['/HomeLayout'],
    children: [
      {
        path: 'friend-group-list',
        name: 'FriendGroupList',
        component: () => import('@/views/user/friend-group-list.vue'),
        meta: { title: '好友与群组', requiresAuth: true },
        alias: ['/FriendGroupList'],
      },
      {
        path: 'user-setting',
        name: 'userSetting',
        component: () => import('@/views/user/user-setting.vue'),
        meta: { title: '设置', requiresAuth: true },
        alias: ['/userSetting'],
      },
      {
        path: 'user-chat',
        name: 'userChat',
        component: () => import('@/views/user/user-chat.vue'),
        meta: { title: '聊天', requiresAuth: true },
        alias: ['/userChat'],
      },
      {
        path: 'user-info',
        name: 'userInfo',
        component: () => import('@/views/user/user-info.vue'),
        meta: { title: '个人信息', requiresAuth: true },
        alias: ['/userInfo'],
      },
      {
        path: 'ai-chat',
        name: 'aiChat',
        component: () => import('@/views/ai/ai-chat.vue'),
        meta: { title: 'AI 聊天', requiresAuth: true },
        alias: ['/aiChat'],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore(pinia)
  const stored = getStorage(USER_LOGIN_INFO)

  // accessToken 在内存中（页面刷新后为空），uid 在 localStorage 中持久化
  // 两者任一存在即视为已登录；accessToken 过期时由请求拦截器静默刷新
  const isLoggedIn = userStore.accessToken || stored?.uid

  if (to.meta?.requiresAuth && !isLoggedIn) {
    closeWebSocket()
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.path === '/login' && !isLoggedIn) {
    closeWebSocket()
  }

  return true
})

router.afterEach((to) => {
  const base = import.meta.env?.VITE_APP_TITLE || 'aiChat'
  const title = to.meta?.title ? `${to.meta.title} - ${base}` : base
  document.title = title
})

export default router
