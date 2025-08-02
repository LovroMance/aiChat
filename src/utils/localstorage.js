const USER_INFO = 'user-info'

// localstorage 接口
export const setStorage = (key, value) => {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
}

    // 将用户信息存储到本地
export const setUserStorage = (userInfo) => {
    if (typeof value === 'object') {
        userInfo = JSON.stringify(userInfo)
    }
    setStorage(USER_INFO, userInfo)
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