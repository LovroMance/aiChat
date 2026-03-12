import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const account = ref('') // 账号
  const uid = ref('') // 用户ID
  const accessToken = ref('') // 访问令牌（仅存内存，不持久化）
  const username = ref('') // 用户名
  const password = ref('') // 密码
  const avatar = ref('') // 头像
  const email = ref('') // 邮箱

  // 设置登录信息
  const setLoginInfo = (newInfo) => {
    uid.value = newInfo.uid
    accessToken.value = newInfo.accessToken
  }

  // 单独更新 access token（用于静默刷新场景）
  const setAccessToken = (newToken) => {
    accessToken.value = newToken
  }

  // 编辑更新个人资料
  const setUserInfo = (newInfo) => {
    account.value = newInfo.account
    username.value = newInfo.username
    avatar.value = newInfo.avatar
    email.value = newInfo.email
  }

  // 获取用户信息
  const getUserInfo = () => {
    return {
      account: account.value,
      username: username.value,
      avatar: avatar.value,
      email: email.value,
    }
  }

  // 清除登录信息
  const clearLoginInfo = () => {
    uid.value = ''
    accessToken.value = ''
  }

  return {
    account,
    username,
    password,
    accessToken,
    uid,
    avatar,
    email,
    setLoginInfo,
    setAccessToken,
    setUserInfo,
    getUserInfo,
    clearLoginInfo,
  }
})
