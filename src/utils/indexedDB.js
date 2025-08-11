/**
 * IndexedDB 数据库操作工具
 * 提供简单的数据存储、查询、更新、删除功能
 */

// 数据库配置
const DB_NAME = 'aiChatDB'
const DB_VERSION = 1
let db = null

// 存储对象名称常量
export const MESSAGES_STORE = 'messages'
export const USERS_STORE = 'users'
export const FILES_STORE = 'files'

/**
 * 初始化数据库
 * @returns {Promise} 返回数据库连接
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    // 如果数据库已打开，则直接返回
    if (db) {
      console.log('数据库已打开', db);
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
      console.log('数据库连接成功')
      db = event.target.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result

      // 创建消息存储
      if (!database.objectStoreNames.contains(MESSAGES_STORE)) {
        const messageStore = database.createObjectStore(MESSAGES_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        messageStore.createIndex('timestamp', 'timestamp', { unique: false })
        messageStore.createIndex('senderId', 'senderId', { unique: false })
      }

      // 创建用户信息存储
      if (!database.objectStoreNames.contains(USERS_STORE)) {
        const userStore = database.createObjectStore(USERS_STORE, { keyPath: 'id' })
        userStore.createIndex('username', 'username', { unique: true })
      }

      // 创建文件存储
      if (!database.objectStoreNames.contains(FILES_STORE)) {
        const fileStore = database.createObjectStore(FILES_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        fileStore.createIndex('filename', 'filename', { unique: false })
        fileStore.createIndex('type', 'type', { unique: false })
      }
    }
  })
}

/**
 * 确保数据库已打开
 * @returns {Promise} 返回数据库连接
 */
export const ensureDBOpen = async () => {
  if (!db) {
    console.log('数据库未初始化，正在打开数据库...')
    return await initDB()
  }
  return db
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
 * 批量添加数据到存储对象
 * @param {string} storeName - 存储对象名称
 * @param {Array} dataArray - 要存储的数据数组
 * @returns {Promise} 返回添加的数据ID数组
 */
export const addBatchData = async (storeName, dataArray) => {
  try {
    await ensureDBOpen()

    if (!Array.isArray(dataArray)) {
      throw new Error('数据必须是数组格式')
    }

    if (dataArray.length === 0) {
      return []
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const results = []
        let completed = 0
        let hasError = false

        dataArray.forEach((data, index) => {
          const request = store.add(data)

          request.onsuccess = () => {
            results[index] = request.result
            completed++
            
            if (completed === dataArray.length && !hasError) {
              resolve(results)
            }
          }

          request.onerror = () => {
            hasError = true
            console.error(`批量添加数据失败，索引 ${index}:`, request.error)
            reject(new Error(`批量添加数据失败，索引 ${index}: ${request.error}`))
          }
        })
      } catch (error) {
        console.error('批量添加数据操作失败:', error)
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
            // 找到最后一条数据
            resolve(cursor.value)
          } else {
            // 没有数据
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
 * 清空存储对象中的所有数据
 * @param {string} storeName - 存储对象名称
 * @returns {Promise} 返回清空结果
 */
export const clearData = async (storeName) => {
  try {
    await ensureDBOpen()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => {
          resolve(true)
        }

        request.onerror = () => {
          console.error('清空数据失败')
          reject(new Error('清空数据失败'))
        }
      } catch (error) {
        console.error('清空数据操作失败:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('数据库打开失败:', error)
    throw error
  }
}

/**
 * 关闭数据库连接
 */
export const closeDB = () => {
  if (db) {
    db.close()
    db = null
    console.log('数据库连接已关闭')
  }
}

// 使用示例：
/*
// 1. 初始化数据库
await initDB()

// 2. 添加消息
const messageId = await addData(MESSAGES_STORE, {
  content: 'Hello World',
  senderId: 123,
  timestamp: Date.now(),
  type: 'text'
})

// 3. 查询消息
const message = await getData(MESSAGES_STORE, messageId)

// 4. 根据时间戳查询消息
const recentMessages = await getDataByIndex(MESSAGES_STORE, 'timestamp', Date.now() - 86400000)

// 5. 更新消息
await updateData(MESSAGES_STORE, {
  id: messageId,
  content: 'Updated message',
  senderId: 123,
  timestamp: Date.now(),
  type: 'text'
})

// 6. 删除消息
await deleteData(MESSAGES_STORE, messageId)

// 7. 清空所有消息
await clearData(MESSAGES_STORE)
*/
