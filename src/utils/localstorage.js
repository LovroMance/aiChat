export const USER_LOGIN_INFO = 'user-login-info' // 用户登录信息
export const USER_INFO_DATA = 'user-info-data' // 用户详细信息

// localstorage 接口
export const setStorage = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}

// 获取本地存储数据
export const getStorage = (key) => {
  try {
    const value = localStorage.getItem(key)
    if (value === null) {
      return null
    }
    // 尝试 JSON 解析
    try {
      return JSON.parse(value)
    } catch {
      // 解析失败说明不是 JSON 格式 直接返回（例如字符串类或整数类型）
      return value
    }
  } catch (error) {
    console.error('获取本地存储数据失败:', error)
    return null
  }
}

// 移除本地存储数据
export const removeStorage = (key) => {
  localStorage.removeItem(key)
}

// 清空本地存储数据 (勿随意使用)
export const clearStorage = () => {
  localStorage.clear()
}
