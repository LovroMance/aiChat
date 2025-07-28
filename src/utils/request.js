import axios from 'axios'
// import { useUserStore } from '@/stores'

const baseURL = 'http://localhost:8080'

const instance = axios.create({
  baseURL,
  timeout: 50000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // const userStore = useUserStore()
    // if ( userStore.token ) {
    //   config.headers.Authorization = userStore.token
    // }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    return res
  },
  (err) => {
    // TODO 5. 处理401错误
    return Promise.reject(err)
  }
)

export default instance
