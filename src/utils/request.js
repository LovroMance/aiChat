import axios from 'axios'
import { useUserStore } from '@/stores/index'
import { USER_LOGIN_INFO, getStorage } from './localstorage'
import { showErrorTip } from './messageTips'
const token = getStorage(USER_LOGIN_INFO)?.token

const baseURL = import.meta.env?.VITE_APP_API_BASE

const instance = axios.create({
  baseURL,
  timeout: 50000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在拦截器中获取 store，而不是在模块顶层
    const userStore = useUserStore()

    if (userStore.token) {
      config.headers.Authorization = 'JWT ' + userStore.token
    } else if (token) {
      config.headers.Authorization = 'JWT ' + token
    }
    return config
  },
  (err) => Promise.reject(err),
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO： 有一些 HTTP 状态码 200 但后端业务码非成功 的情况，需要根据后端接口规范进行适配
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
  (err) => {
    // 拦截器统一处理网络层和 HTTP 层错误提示
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
