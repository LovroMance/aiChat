// 格式化时间
export const formatTime = (timeString) => {
  if (!timeString) return ''
  try {
    const date = new Date(timeString)
    const year = date.getFullYear().toString().slice(-2) // 取年份后两位
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch (error) {
    console.error('时间格式化错误:', error)
    return timeString
  }
}

// 格式化时间
export const formatTimeHour = (timeString) => {
  if (!timeString) return ''
  try {
    const date = new Date(timeString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
  } catch (error) {
    console.error('时间格式化错误:', error)
    return timeString
  }
}