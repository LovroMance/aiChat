<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
const router = useRouter()

// 获取用户仓库，存储用户信息
import { useUserStore } from '@/stores/index'
import { USER_LOGIN_INFO, setStorage } from '@/utils/localstorage'
const userStore = useUserStore()

const account = ref('')
const password = ref('')

// 登录api调用
import { useUserLogin } from '@/api/user'
const userLogin = async () => {
  if (!account.value || !password.value) {
    ElMessage({
      message: '请输入账号和密码',
      type: 'warning',
    })
    return
  }
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '登录中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    const { data } = await useUserLogin({
      account: account.value,
      password: password.value,
    })
    console.log('userLogin/api', data)
    // 登陆成功就把用户的信息存到UserStore里
    const userInfo = {
      uid: data.uid,
      token: data.token,
    }
    userStore.setLoginInfo(userInfo)
    // 把用户token存到本地存储
    setStorage(USER_LOGIN_INFO, userInfo)
    ElMessage({
      message: '登录成功',
      type: 'success',
    })
    account.value = ''
    password.value = ''
    router.push('/userHome')
  } catch (error) {
    ElMessage({
      message: error.response.data.message,
      type: 'error',
    })
  } finally {
    loadingInstance.close()
  }
}
</script>

<template>
  <div class="login-bg">
    <div class="login-container">
      <h2 class="login-title">登录</h2>
      <div class="login-form">
        <input v-model="account" type="text" placeholder="请输入账号" class="login-input" />
        <input v-model="password" type="password" placeholder="请输入密码" class="login-input" />
        <button class="login-btn" @click="userLogin">登录</button>
        <button class="register-btn" @click="router.push('/register')">注册账号</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #23272e 0%, #3a4047 70%, #6b7b8a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  background: #23272e;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
  padding: 56px 48px 48px 48px; /* 增大内边距 */
  width: 420px; /* 增大宽度 */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-title {
  color: #ececec;
  font-size: 2rem;
  margin-bottom: 28px;
  letter-spacing: 2px;
}
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.login-input {
  width: 100%;
  padding: 12px 18px;
  border: none;
  border-radius: 20px;
  background: #444c56;
  color: #ececec;
  font-size: 1.15rem;
  outline: none;
  transition: background 0.2s;
}
.login-input:focus {
  background: #545c64;
}
.login-btn {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: 20px;
  background: linear-gradient(90deg, #6b7b8a 60%, #545c64 100%);
  color: #ececec;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition:
    background 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.8s cubic-bezier(0.4, 0, 0.2, 1); /* 新增 color 过渡 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.login-btn:hover {
  background: linear-gradient(90deg, #545c64 60%, #6b7b8a 100%);
  box-shadow: 0 8px 32px rgba(107, 123, 138, 0.28);
  color: #fff; /* 悬浮时字体颜色更亮 */
}

.register-btn {
  width: 100%;
  padding: 12px 0;
  border: 2px solid #6b7b8a;
  border-radius: 20px;
  background: transparent;
  color: #6b7b8a;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition:
    background 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.register-btn:hover {
  background: linear-gradient(90deg, #23272e 60%, #6b7b8a 100%);
  color: #ececec;
  border-color: #545c64;
  box-shadow: 0 8px 32px rgba(107, 123, 138, 0.28);
}
</style>
