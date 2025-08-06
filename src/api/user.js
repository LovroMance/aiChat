import instance from '@/utils/request'

// 注册
export const useUserRegister = (data) => {
  return instance.post('/auth/register', {
    account: data.account,
    username: data.username,
    password: data.password,
  })
}

// 登录
export const useUserLogin = (data) => {
  return instance.post('/auth/login', {
    account: data.account,
    password: data.password,
  })
}

// 获取用户信息
export const getUserInfo = (data) => {
  return instance.get('/user/get_user', {
    params: {
      uid: data,
    },
  })
}
