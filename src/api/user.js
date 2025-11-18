import instance from '@/utils/request'

// 注册
export const useUserRegister = (data) => {
  return instance.post('/api/auth/register', {
    account: data.account,
    username: data.username,
    password: data.password,
  })
}

// 登录
export const useUserLogin = (data) => {
  return instance.post('/api/auth/login', {
    account: data.account,
    password: data.password,
  })
}

// 获取用户信息
export const getUserInfo = (data) => {
  return instance.get('/api/user/get-user', {
    params: {
      uid: data,
    },
  })
}

// 更新个人资料
export const updateUserInfo = (data) => {
  return instance.post('/api/user/modify/info', {
    account: data.account,
    username: data.username,
    avatar: data.avatar,
    email: data.email,
    signature: data.signature,
    create_time: data.create_time,
    last_login_time: data.last_login_time,
    status: data.status,
    level: data.level,
    posts: data.posts,
    followers: data.followers,
    following: data.following,
  })
}
