// AI 聊天专用数据库配置
const AI_DB_NAME = 'aiChatAssistantDB'
const AI_DB_VERSION = 1
let aiDB = null

// 存储对象名称
export const AI_THREADS_STORE = 'ai_threads' // AI 对话列表
export const AI_MESSAGES_STORE = 'ai_messages' // AI 消息记录

/**
 * 初始化 AI 数据库
 */
export const initAIDB = () => {
  return new Promise((resolve, reject) => {
    if (aiDB) {
      resolve(aiDB)
      return
    }

    const request = indexedDB.open(AI_DB_NAME, AI_DB_VERSION)

    request.onerror = () => reject('AI 数据库打开失败')
    request.onsuccess = (event) => {
      aiDB = event.target.result
      resolve(aiDB)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // 创建对话列表表
      if (!db.objectStoreNames.contains(AI_THREADS_STORE)) {
        db.createObjectStore(AI_THREADS_STORE, {
          keyPath: 'thread_id',
        })
      }

      // 创建消息表
      if (!db.objectStoreNames.contains(AI_MESSAGES_STORE)) {
        db.createObjectStore(AI_MESSAGES_STORE, {
          keyPath: 'message_id',
        })
      }
    }
  })
}

/**
 * 确保数据库已打开
 */
const ensureDB = async () => {
  if (!aiDB) await initAIDB()
  return aiDB
}

/**
 * 获取所有数据
 */
export const getAllAIData = async (storeName) => {
  await ensureDB()
  return new Promise((resolve, reject) => {
    const transaction = aiDB.transaction([storeName], 'readonly')
    const request = transaction.objectStore(storeName).getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject('查询失败')
  })
}

/**
 * 根据主键获取数据
 */
export const getAIDataByKey = async (storeName, key) => {
  await ensureDB()
  return new Promise((resolve, reject) => {
    const transaction = aiDB.transaction([storeName], 'readonly')
    const request = transaction.objectStore(storeName).get(key)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject('查询失败')
  })
}

/**
 * 根据索引查询
 */
export const getAIDataByIndex = async (storeName, indexName, value) => {
  await ensureDB()
  return new Promise((resolve, reject) => {
    const transaction = aiDB.transaction([storeName], 'readonly')
    const index = transaction.objectStore(storeName).index(indexName)
    const request = index.getAll(value)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject('查询失败')
  })
}

/**
 * 更新或添加数据
 */
export const putAIData = async (storeName, data) => {
  await ensureDB()
  return new Promise((resolve, reject) => {
    const transaction = aiDB.transaction([storeName], 'readwrite')
    const request = transaction.objectStore(storeName).put(data)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject('保存失败')
  })
}

/**
 * 删除数据
 */
export const deleteAIData = async (storeName, key) => {
  await ensureDB()
  return new Promise((resolve, reject) => {
    const transaction = aiDB.transaction([storeName], 'readwrite')
    const request = transaction.objectStore(storeName).delete(key)
    request.onsuccess = () => resolve()
    request.onerror = () => reject('删除失败')
  })
}

/**
 * 清空表
 */
export const clearAIStore = async (storeName) => {
  await ensureDB()
  return new Promise((resolve, reject) => {
    const transaction = aiDB.transaction([storeName], 'readwrite')
    const request = transaction.objectStore(storeName).clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject('清空失败')
  })
}
