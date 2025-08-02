import instance from '@/utils/request'

// 注册
export const useUserRegister = (data) => {
  return instance.post('/auth/register', {
    username: data.username,
    account: 'avbasdasdf',  // TODO：账号要改成随机数
    password: data.password,
  })
}

// 登录
export const useUserLogin = (data) => {
  return instance.post('/auth/login', {
    account: 'avbasdasdf',
    password: data.password,
  })
}
