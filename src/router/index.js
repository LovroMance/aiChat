import { createRouter, createWebHistory } from 'vue-router'
// 配置路由规则
const routes = [
  {
    path: '/test',
    component: () => import('@/components/file/uploadAvatar.vue'),
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/authentication/login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/authentication/register.vue'),
  },
  {
    path: '/userHome',
    name: 'userHome',
    component: () => import('@/views/User/userHome.vue'),
  },
  {
    path: '/homePage',
    name: 'homePage',
    component: () => import('@/views/Home/homePage.vue'),
    children: [
      {
        path: '/FriendGroupList',
        name: 'FriendGroupList',
        component: () => import('@/views/Home/FriendGroupList.vue'),
      },
      {
        path: '/userSetting',
        name: 'userSetting',
        component: () => import('@/views/User/userSetting.vue'),
      },
      {
        path: '/userChat',
        name: 'userChat',
        component: () => import('@/views/User/userChat.vue'),
      },
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('@/views/User/userInfo.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
