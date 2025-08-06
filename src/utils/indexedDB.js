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
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('数据库打开失败')
      reject(new Error('数据库打开失败'))
    }

    request.onsuccess = (event) => {
      db = event.target.result
      resolve(db)
      console.log('数据库连接成功')
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result

      // 创建消息存储
      if (!database.objectStoreNames.contains(MESSAGES_STORE)) {
        const messageStore = database.createObjectStore(MESSAGES_STORE, { 
          keyPath: 'id', 
          autoIncrement: true 
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
          autoIncrement: true 
        })
        fileStore.createIndex('filename', 'filename', { unique: false })
        fileStore.createIndex('type', 'type', { unique: false })
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
export const addData = (storeName, data) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('数据库未初始化')
      reject(new Error('数据库未初始化'))
      return
    }

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
}

/**
 * 根据ID获取数据
 * @param {string} storeName - 存储对象名称
 * @param {any} id - 数据ID
 * @returns {Promise} 返回查询到的数据
 */
export const getData = (storeName, id) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('数据库未初始化')
      reject(new Error('数据库未初始化'))
      return
    }

    try {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        console.error('查询数据失败')
        reject(new Error('查询数据失败'))
      }
    } catch (error) {
      console.error('查询数据操作失败:', error)
      reject(error)
    }
  })
}

/**
 * 获取存储对象中的所有数据
 * @param {string} storeName - 存储对象名称
 * @returns {Promise} 返回所有数据
 */
export const getAllData = (storeName) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('数据库未初始化')
      reject(new Error('数据库未初始化'))
      return
    }

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
}

/**
 * 根据索引查询数据
 * @param {string} storeName - 存储对象名称
 * @param {string} indexName - 索引名称
 * @param {any} value - 索引值
 * @returns {Promise} 返回查询到的数据
 */
export const getDataByIndex = (storeName, indexName, value) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('数据库未初始化')
      reject(new Error('数据库未初始化'))
      return
    }

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
}

/**
 * 更新数据
 * @param {string} storeName - 存储对象名称
 * @param {Object} data - 要更新的数据
 * @returns {Promise} 返回更新结果
 */
export const updateData = (storeName, data) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('数据库未初始化')
      reject(new Error('数据库未初始化'))
      return
    }

    try {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        console.error('更新数据失败')
        reject(new Error('更新数据失败'))
      }
    } catch (error) {
      console.error('更新数据操作失败:', error)
      reject(error)
    }
  })
}

/**
 * 删除数据
 * @param {string} storeName - 存储对象名称
 * @param {any} id - 数据ID
 * @returns {Promise} 返回删除结果
 */
export const deleteData = (storeName, id) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('数据库未初始化')
      reject(new Error('数据库未初始化'))
      return
    }

    try {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = () => {
        console.error('删除数据失败')
        reject(new Error('删除数据失败'))
      }
    } catch (error) {
      console.error('删除数据操作失败:', error)
      reject(error)
    }
  })
}

/**
 * 清空存储对象中的所有数据
 * @param {string} storeName - 存储对象名称
 * @returns {Promise} 返回清空结果
 */
export const clearData = (storeName) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error('数据库未初始化')
      reject(new Error('数据库未初始化'))
      return
    }

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

/**
 * 删除整个数据库
 * @param {string} dbName - 数据库名称，默认为当前数据库
 * @returns {Promise} 返回删除结果
 */
export const deleteDB = (dbName = DB_NAME) => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.deleteDatabase(dbName)

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = () => {
        console.error('删除数据库失败')
        reject(new Error('删除数据库失败'))
      }
    } catch (error) {
      console.error('删除数据库操作失败:', error)
      reject(error)
    }
  })
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
