import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import { showWarningTip } from '@/utils/messageTips'
import { useUserLogin } from '@/api/user' // 调用登录API
import { useUserStore } from '@/stores/index' // 获取用户仓库，存储用户信息
import { USER_LOGIN_INFO, setStorage } from '@/utils/localstorage' // localstorage封装

export default function useLoginService() {
  const router = useRouter()
  const userStore = useUserStore()

  // 登录的表单数据
  const loginForm = ref({
    account: '',
    password: '',
  })

  // 用户登录逻辑
  const handleLogin = async () => {
    if (!loginForm.value.account || !loginForm.value.password) {
      showWarningTip('请输入账号和密码')
      return
    }
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '登录中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
      const { data } = await useUserLogin({
        account: loginForm.value.account,
        password: loginForm.value.password,
      })
      console.log('userLogin/api', data)
      // 登陆成功就把用户的信息存到UserStore里
      const userInfo = {
        uid: data.data.uid,
        token: data.data.token,
      }
      userStore.setLoginInfo(userInfo)
      // 把用户token存到本地存储
      setStorage(USER_LOGIN_INFO, userInfo)
      loginForm.value.account = ''
      loginForm.value.password = ''
      router.push('/userHome')
    } catch (error) {
      // 错误提示交由响应拦截器统一处理，这里仅消费异常避免 Vue 事件未处理告警。
      console.error('登录请求失败:', error)
    } finally {
      loadingInstance.close()
    }
  }

  const goRegister = () => {
    router.push('/register')
  }

  return {
    loginForm,
    handleLogin,
    goRegister,
  }
}
