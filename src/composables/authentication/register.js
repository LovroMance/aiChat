import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showWarningTip, showSuccessTip } from '@/utils/messageTips'

import { useUserRegister } from '@/api/user' // 注册api调用

export default function useRegisterService() {
  const router = useRouter()

  // 注册的表单数据
  const registerForm = ref({
    account: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  // 提交注册表单
  const userRegister = async () => {
    const { data } = await useUserRegister({
      account: registerForm.value.account,
      username: registerForm.value.username,
      password: registerForm.value.password,
    })
    console.log(data)
    showSuccessTip('注册成功')
    router.push('/login')
  }

  // 提交注册表单 -- 校验 -> 提交
  const handleRegister = async () => {
    const accountRegex = /^[a-zA-Z0-9]{8,15}$/
    if (!accountRegex.test(registerForm.value.account)) {
      showWarningTip('账号不符合要求，请输入8-15位字母或数字')
      return
    }
    if (!registerForm.value.username) {
      showWarningTip('请填写用户名')
      return
    }
    if (!registerForm.value.password) {
      showWarningTip('请填写密码')
      return
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(registerForm.value.password)) {
      showWarningTip('密码必须包含数字和字母，长度不低于8位')
      return
    }
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      showWarningTip('两次输入的密码不一致')
      return
    }
    try {
      await userRegister()
    } catch (error) {
      // 错误提示由响应拦截器统一处理
      console.error('注册失败:', error)
    }
  }

  const goLogin = () => {
    router.push('/login')
  }

  return {
    registerForm,
    handleRegister,
    goLogin,
  }
}
