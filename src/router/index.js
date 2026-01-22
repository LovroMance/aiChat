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
    component: () => import('@/views/home/user-home.vue'),
  },
  {
    path: '/HomeLayout',
    name: 'HomeLayout',
    component: () => import('@/layout/home-layout.vue'),
    children: [
      {
        path: '/FriendGroupList',
        name: 'FriendGroupList',
        component: () => import('@/views/user/friend-group-list.vue'),
      },
      {
        path: '/userSetting',
        name: 'userSetting',
        component: () => import('@/views/user/user-setting.vue'),
      },
      {
        path: '/userChat',
        name: 'userChat',
        component: () => import('@/views/user/user-chat.vue'),
      },
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('@/views/user/user-info.vue'),
      },
      {
        path: '/aiChat',
        name: 'aiChat',
        component: () => import('@/views/ai/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
