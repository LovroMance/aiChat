import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useUserStore = defineStore('user', () => {
  const account = ref('') // 账号
  const uid = ref('')  // 用户ID
  const token = ref('')  // 令牌

  const username = ref('')  // 用户名
  const password = ref('')  // 密码

  const avatar = ref('')  // 头像
  const signature = ref('')  // 个性签名
  const email = ref('')  // 邮箱
  const createTime = ref('')  // 创建时间
  const lastLoginTime = ref('')  // 最后登录时间
  const status = ref('')  // 状态
  const level = ref('')  // 等级
  const posts = ref('')  // 帖子数量
  const followers = ref('')  // 粉丝数量
  const following = ref('')  // 关注数量

  // 设置登录信息
  const setLoginInfo = (newInfo) => {
    uid.value = newInfo.uid
    token.value = newInfo.token
  }

  // 编辑更新个人资料
  const setUserInfo = (newInfo) => {
    account.value = newInfo.account
    username.value = newInfo.username
    avatar.value = newInfo.avatar
    signature.value = newInfo.signature
    email.value = newInfo.email
    createTime.value = newInfo.create_time
    lastLoginTime.value = newInfo.last_login_time
    status.value = newInfo.status
    level.value = newInfo.level
    posts.value = newInfo.posts
    followers.value = newInfo.followers
    following.value = newInfo.following
  }

  // 获取用户信息
  const getUserInfo = () => {
    return {
      account: account.value,
      username: username.value,
      avatar: avatar.value,
      signature: signature.value,
      email: email.value,
      createTime: createTime.value,
      lastLoginTime: lastLoginTime.value,
      status: status.value,
      level: level.value,
      posts: posts.value,
      followers: followers.value,
      following: following.value,
    }
  }

  // 清除登录信息
  const clearLoginInfo = () => {
    uid.value = ''
    token.value = ''
  }

  return {
    account,
    username,
    password,
    token,
    uid,
    avatar,
    signature,
    email,
    createTime,
    lastLoginTime,
    status,
    level,
    posts,
    followers,
    following,
    setLoginInfo,
    setUserInfo,
    getUserInfo,
    clearLoginInfo,
  }
})
