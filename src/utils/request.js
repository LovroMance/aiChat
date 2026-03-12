import axios from 'axios'
import { useUserStore } from '@/stores/index'
// import { USER_LOGIN_INFO, removeStorage } from './localstorage'
import { showErrorTip } from './messageTips'

const baseURL = import.meta.env?.VITE_APP_API_BASE

const instance = axios.create({
  baseURL,
  timeout: 50000,
})

// ─── 请求拦截器 ────────────────────────────────────────────────
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (!config._skipAuthHeader && userStore.accessToken) {
      config.headers.Authorization = userStore.accessToken
    }
    return config
  },
  (err) => Promise.reject(err),
)

// ─── 静默刷新队列（并发 401 时只发一次 refresh 请求）────────────
// let isRefreshing = false
// let pendingQueue = []

// const processQueue = (error, token = null) => {
//   pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
//   pendingQueue = []
// }

// // 退出登录并跳转（清 store + localStorage uid）
// const forceLogout = () => {
//   const userStore = useUserStore()
//   userStore.clearLoginInfo()
//   removeStorage(USER_LOGIN_INFO)
//   window.location.href = '/login'
// }

// ─── 响应拦截器 ────────────────────────────────────────────────
instance.interceptors.response.use(
  (res) => {
    const responseData = res?.data
    if (
      responseData &&
      typeof responseData === 'object' &&
      typeof responseData.code === 'number' &&
      responseData.code !== 200
    ) {
      const message = responseData.message || '请求失败，请稍后重试'
      const businessError = new Error(message)
      businessError.__handledByInterceptor = true
      showErrorTip(message)
      return Promise.reject(businessError)
    }
    return res
  },
  async (err) => {
    // const originalRequest = err.config

    // // 401 → 尝试用 refresh_token（httpOnly Cookie）换新 access_token
    // if (
    //   err?.response?.status === 401 &&
    //   !originalRequest.__retried &&
    //   originalRequest.url !== '/auth/refresh'
    // ) {
    //   if (isRefreshing) {
    //     // 已有刷新进行中，排队等待新 token
    //     return new Promise((resolve, reject) => {
    //       pendingQueue.push({ resolve, reject })
    //     }).then((token) => {
    //       originalRequest.headers.Authorization = token
    //       return instance(originalRequest)
    //     })
    //   }

    //   originalRequest.__retried = true
    //   isRefreshing = true

    //   try {
    //     // 通过 api/auth 的统一接口触发刷新；动态导入可避免 request<->auth 静态循环依赖
    //     const { useRefreshToken } = await import('@/api/auth')
    //     const { data } = await useRefreshToken()
    //     const newToken = data.data.access_token
    //     useUserStore().setAccessToken(newToken)
    //     processQueue(null, newToken)
    //     originalRequest.headers.Authorization = newToken
    //     // 页面刷新后 token 从这里恢复，顺带补全 WebSocket 连接
    //     import('@/utils/websocket').then(({ ensureWebSocketConnected, chatPath }) => {
    //       ensureWebSocketConnected(chatPath)
    //     })
    //     return instance(originalRequest)
    //   } catch (refreshErr) {
    //     processQueue(refreshErr, null)
    //     forceLogout()
    //     return Promise.reject(refreshErr)
    //   } finally {
    //     isRefreshing = false
    //   }
    // }

    // 其余错误：统一提示
    let message = '请求失败，请稍后重试'
    if (err?.code === 'ECONNABORTED') {
      message = '请求超时，请稍后重试'
    } else if (!err?.response) {
      message = '网络异常，请检查网络连接'
    } else {
      const status = err.response.status
      const backendMessage = err.response?.data?.message
      if (backendMessage) {
        message = backendMessage
      } else if (status === 401) {
        message = '身份认证已过期，请重新登录'
      } else if (status === 403) {
        message = '暂无权限执行该操作'
      } else if (status >= 500) {
        message = '服务异常，请稍后重试'
      }
    }

    err.__handledByInterceptor = true
    showErrorTip(message)
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
