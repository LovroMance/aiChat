import { ElMessage } from 'element-plus'

const showMessage = (message, type) => {
    ElMessage({
        message,
        type,
        duration: 1500,
    })
}

/**
 * 显示一个警告消息的便捷函数
 * @param {string} message - 要显示的警告内容
 */
export const showWarningMessage = (message) => {
    showMessage(message, 'warning')
}

/**
 * 显示一个错误消息的便捷函数
 * @param {string} message - 要显示的错误内容
 */
export const showErrorMessage = (message) => {
    showMessage(message, 'error')
}

/**
 * 显示一个成功消息的便捷函数
 * @param {string} message - 要显示的成功内容
 */
export const showSuccessMessage = (message) => {
    showMessage(message, 'success')
}
