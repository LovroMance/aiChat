// 可插拔的消息插件管理系统
const plugins = new Map()

export const registerMessagePlugin = (plugin) => {
  if (!plugin?.type) {
    throw new Error('message plugin must provide a type')
  }

  plugins.set(plugin.type, plugin)
  return plugin
}

export const getMessagePlugin = (type) => {
  return plugins.get(type) || plugins.get('unsupported') || null
}

export const getRegisteredMessagePlugins = () => {
  return Array.from(plugins.values())
}

export const resolveMessagePlugin = (message) => {
  if (!message) return getMessagePlugin('unsupported')

  if (message.type && plugins.has(message.type)) {
    return plugins.get(message.type)
  }

  for (const plugin of plugins.values()) {
    if (typeof plugin.match === 'function' && plugin.match(message)) {
      return plugin
    }
  }

  return getMessagePlugin('unsupported')
}
