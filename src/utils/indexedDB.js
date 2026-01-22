// 数据库配置
const DB_NAME = 'aiChatDB'
const DB_VERSION = 1
let db = null

// 存储对象名称常量
export const MESSAGES_STORE = 'messages'
export const UNREAD_MESSAGES_STORE = 'unreadMessages'
export const THREADS_STORE = 'threads'

/**
 * 确保数据库已打开
 * @returns {Promise} 返回数据库连接
 */
export const ensureDBOpen = async () => {
  if (!db) {
    return await initDB()
  }
  return db
}

/**
 * 初始化数据库
 * @returns {Promise} 返回数据库连接
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    // 如果数据库已打开，则直接返回
    if (db) {
      resolve(db)
      return
    }

    // 打开数据库
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('数据库打开失败')
      reject('数据库打开失败')
    }

    request.onsuccess = (event) => {
      db = event.target.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result

      // 创建消息存储
      if (!database.objectStoreNames.contains(MESSAGES_STORE)) {
        const messageStore = database.createObjectStore(MESSAGES_STORE, {
          keyPath: 'msg_id',
        })
        messageStore.createIndex('thread_id', 'thread_id', { unique: false }) // 添加 thread_id 索引
      }

      // 创建未读消息存储
      if (!database.objectStoreNames.contains(UNREAD_MESSAGES_STORE)) {
        const unreadMessageStore = database.createObjectStore(UNREAD_MESSAGES_STORE, {
          keyPath: 'thread_id',
        })
        unreadMessageStore.createIndex('thread_id', 'thread_id', { unique: false }) // 添加 thread_id 索引
        unreadMessageStore.createIndex('last_time', 'last_time', { unique: false }) // 添加 last_time 索引
      }

      // 创建thread存储
      if (!database.objectStoreNames.contains(THREADS_STORE)) {
        const threadStore = database.createObjectStore(THREADS_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        threadStore.createIndex('thread_id', 'thread_id', { unique: false }) // 添加 thread_id 索引
      }
    }
  })
}

/**
 * 添加数据到存储对象
 * @param {string} storeName - 存储对象名称
 * @param {Object} data - 要存储的数据
 * @returns {Promise} 返回添加的数据ID
 */
export const addData = async (storeName, data) => {
  try {
    await ensureDBOpen()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.add(data)

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onerror = () => {
          console.error('添加数据失败')
          reject(new Error('添加数据失败'))
        }
      } catch (error) {
        console.error('添加数据操作失败:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('数据库打开失败:', error)
    throw error
  }
}

/**
 * 获取存储对象中的所有数据
 * @param {string} storeName - 存储对象名称
 * @returns {Promise} 返回所有数据
 */
export const getAllData = async (storeName) => {
  try {
    await ensureDBOpen()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAll()

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onerror = () => {
          console.error('查询所有数据失败')
          reject(new Error('查询所有数据失败'))
        }
      } catch (error) {
        console.error('查询所有数据操作失败:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('数据库打开失败:', error)
    throw error
  }
}

/**
 * 获取最后一条新数据
 * @param {string} storeName - 存储对象名称
 * @param {string} indexName - 索引名称（可选，默认为'timestamp'）
 * @returns {Promise} 返回最后一条数据
 */
export const getLastData = async (storeName) => {
  try {
    await ensureDBOpen()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)

        // 使用主键游标
        const request = store.openCursor(null, 'prev')

        request.onsuccess = (event) => {
          const cursor = event.target.result
          if (cursor) {
            resolve(cursor.value)
          } else {
            resolve(null)
          }
        }

        request.onerror = () => {
          console.error('获取最后一条数据失败')
          reject(new Error('获取最后一条数据失败'))
        }
      } catch (error) {
        console.error('获取最后一条数据操作失败:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('数据库打开失败:', error)
    throw error
  }
}

/**
 * 根据主键获取单条数据
 */
export const getDataByKey = async (storeName, key) => {
  try {
    await ensureDBOpen()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.get(key)

        request.onsuccess = () => {
          resolve(request.result ?? null)
        }

        request.onerror = () => {
          console.error('根据主键查询数据失败')
          reject(new Error('根据主键查询数据失败'))
        }
      } catch (error) {
        console.error('根据主键查询数据操作失败:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('数据库打开失败:', error)
    throw error
  }
}

/**
 * 根据索引查询数据
 * @param {string} storeName - 存储对象名称
 * @param {string} indexName - 索引名称
 * @param {any} value - 索引值
 * @returns {Promise} 返回查询到的数据
 */
export const getDataByIndex = async (storeName, indexName, value) => {
  try {
    await ensureDBOpen()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const index = store.index(indexName)
        const request = index.getAll(value)

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onerror = () => {
          console.error('根据索引查询数据失败')
          reject(new Error('根据索引查询数据失败'))
        }
      } catch (error) {
        console.error('根据索引查询数据操作失败:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('数据库打开失败:', error)
    throw error
  }
}

/**
 * 添加或更新数据到存储对象（如果主键存在则覆盖，不存在则新增）
 * @param {string} storeName - 存储对象名称
 * @param {Object} data - 要存储的数据
 * @returns {Promise} 返回操作的数据ID
 */
export const putData = async (storeName, data) => {
  try {
    await ensureDBOpen()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.put(data) // put方法会自动覆盖相同主键的数据

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onerror = () => {
          console.error('保存/更新数据失败')
          reject(new Error('保存/更新数据失败'))
        }
      } catch (error) {
        console.error('保存/更新数据操作失败:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('数据库打开失败:', error)
    throw error
  }
}

/**
 * 根据 thread_id 获取特定会话的所有消息
 * @param {number|string} threadId - 会话 ID
 * @returns {Promise} 返回该会话的所有消息，按时间排序
 */
export const getMessagesByThreadId = async (storeName, threadId) => {
  try {
    const messages = await getDataByIndex(storeName, 'thread_id', threadId)
    return messages
  } catch (error) {
    console.error(`获取会话 ${threadId} 的消息失败:`, error)
    throw error
  }
}

/**
 * 根据 thread_id 获取最新的 N 条消息
 * @param {number|string} threadId - 会话 ID
 * @param {number} limit - 限制数量，默认 50
 * @returns {Promise} 返回最新的 N 条消息
 */
export const getRecentMessagesByThreadId = async (storeName, threadId, limit = 50) => {
  try {
    const allMessages = await getMessagesByThreadId(storeName, threadId)
    // 返回最新的 N 条消息
    return allMessages.slice(-limit)
  } catch (error) {
    console.error(`获取会话 ${threadId} 的最新消息失败:`, error)
    throw error
  }
}
