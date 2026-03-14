import instance from '@/utils/request'

// 刷新 access_token：优先依赖浏览器自动携带的 httpOnly refresh_token Cookie。
// 为兼容接口文档，也保留可选 refresh_token 入参（当前前端不存 refresh_token）。
export const useRefreshToken = () => {
  return instance.post(
    '/auth/refresh',
    {},
    {
      withCredentials: true,
      _skipAuthHeader: true,
      _skipErrorTip: true,
    },
  )
}
