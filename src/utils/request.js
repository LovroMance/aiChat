import axios from 'axios'
import { useUserStore } from '@/stores/index'
import { USER_LOGIN_INFO, removeStorage } from './localstorage'
import { showErrorTip } from './messageTips'

const baseURL = import.meta.env?.VITE_APP_API_BASE

const instance = axios.create({
  baseURL,
  timeout: 50000,
})

const REFRESH_ENDPOINT = '/auth/refresh'

// ─── Auth 编排层：单飞刷新与请求排队 ─────────────────────────────
let isRefreshing = false
let pendingQueue = []
let isLoggingOut = false

const flushPendingQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  pendingQueue = []
}

const enqueuePendingRequest = () => {
  return new Promise((resolve, reject) => {
    pendingQueue.push({ resolve, reject })
  })
}

const retryRequestWithToken = (originalRequest, token) => {
  originalRequest.headers = originalRequest.headers || {}
  originalRequest.headers.Authorization = token
  return instance(originalRequest)
}

const shouldTryRefresh = (error) => {
  const status = error?.response?.status
  const originalRequest = error?.config

  if (status !== 401 || !originalRequest) {
    return false
  }

  if (originalRequest.__retried) {
    return false
  }

  if (originalRequest.url === REFRESH_ENDPOINT) {
    return false
  }

  return true
}

const requestNewAccessToken = async () => {
  const { useRefreshToken } = await import('@/api/auth')
  const { data } = await useRefreshToken()
  const newToken = data?.data?.access_token

  if (!newToken) {
    const tokenError = new Error('刷新登录状态失败，请重新登录')
    tokenError.__handledByInterceptor = true
    throw tokenError
  }

  useUserStore().setAccessToken(newToken)
  return newToken
}

const forceLogout = () => {
  if (isLoggingOut) {
    return
  }

  isLoggingOut = true

  const userStore = useUserStore()
  userStore.clearLoginInfo()
  removeStorage(USER_LOGIN_INFO)

  showErrorTip('身份认证已过期，请重新登录')
  window.location.href = '/login'
}

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
      if (res?.config?._skipErrorTip) {
        const businessError = new Error(responseData.message || '请求失败，请稍后重试')
        businessError.__handledByInterceptor = true
        return Promise.reject(businessError)
      }

      const message = responseData.message || '请求失败，请稍后重试'
      const businessError = new Error(message)
      businessError.__handledByInterceptor = true
      showErrorTip(message)
      return Promise.reject(businessError)
    }
    return res
  },
  async (err) => {
    const originalRequest = err?.config

    // 401 -> 单飞 refresh + 队列重放
    if (shouldTryRefresh(err)) {
      if (isRefreshing) {
        return enqueuePendingRequest().then((token) =>
          retryRequestWithToken(originalRequest, token),
        )
      }

      originalRequest.__retried = true
      isRefreshing = true

      try {
        const newToken = await requestNewAccessToken()
        flushPendingQueue(null, newToken)
        return retryRequestWithToken(originalRequest, newToken)
      } catch (refreshErr) {
        refreshErr.__handledByInterceptor = true
        flushPendingQueue(refreshErr, null)
        forceLogout()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    if (err?.__handledByInterceptor) {
      return Promise.reject(err)
    }

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
        // 401 在 refresh 失败时已走 forceLogout 提示，其他 401 维持兜底提示。
        message = '身份认证已过期，请重新登录'
      } else if (status === 403) {
        message = '暂无权限执行该操作'
      } else if (status >= 500) {
        message = '服务异常，请稍后重试'
      }
    }

    err.__handledByInterceptor = true
    if (!err?.config?._skipErrorTip) {
      showErrorTip(message)
    }
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
