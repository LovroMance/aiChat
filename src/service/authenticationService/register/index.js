import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

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
    ElMessage({
      message: '注册成功',
      type: 'success',
    })
    router.push('/login')
  }

  // 提交注册表单 -- 校验 -> 提交
  const handleRegister = () => {
    const accountRegex = /^[a-zA-Z0-9]{8,15}$/
    if (!accountRegex.test(registerForm.value.account)) {
      ElMessage({
        message: '账号不符合要求，请输入8-15位字母或数字',
        type: 'warning',
      })
      return
    }
    if (!registerForm.value.username) {
      ElMessage({
        message: '请填写正确的用户名',
        type: 'warning',
      })
      return
    }
    if (!registerForm.value.password) {
      ElMessage({
        message: '请填写密码',
        type: 'warning',
      })
      return
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(registerForm.value.password)) {
      ElMessage({
        message: '密码必须包含数字和字母，长度不低于8位',
        type: 'warning',
      })
      return
    }
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      ElMessage({
        message: '两次输入的密码不一致',
        type: 'warning',
      })
      return
    }
    userRegister()
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
