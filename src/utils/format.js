// 格式化时间
export const formatTime = (timestamp) => {
  // 如果传入的是无效值（如 null, undefined, 0），则返回空字符串
  if (!timestamp) return ''

  try {
    // new Date() 可以直接接收数字类型的时间戳（毫秒）
    const date = new Date(timestamp * 1000)

    // 获取年份的后两位
    const year = String(date.getFullYear()).slice(-2)
    // getMonth() 返回的月份是从0开始的，所以需要+1
    // padStart(2, '0') 用于确保月份、日期等是两位数，不足则在前面补0
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('时间戳格式化错误:', error)
    // 如果发生错误，返回空字符串
    return ''
  }
}

// 格式化时间
export const formatTimeHour = (timeString) => {
  if (!timeString) return ''
  try {
    const date = new Date(timeString * 1000)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
  } catch (error) {
    console.error('时间格式化错误:', error)
    return timeString
  }
}
