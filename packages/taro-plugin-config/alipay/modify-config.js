function modifyConfig(configMap) {
  for (const key in configMap) {
    const content = Reflect.get(configMap, key) || {}
    const config = Reflect.get(content, 'content')

    if (!config) continue

    if (key === 'app.config') {
      const windowConfig = Reflect.get(config, 'window') || {}

      if (windowConfig.navigationStyle === 'custom') {
        Reflect.deleteProperty(windowConfig, 'navigationStyle')
        Reflect.set(windowConfig, 'transparentTitle', 'always')
        Reflect.set(windowConfig, 'titlePenetrate', 'YES')
        Reflect.set(config, 'window', windowConfig)
      }
    } else if (config.navigationStyle === 'default') {
      Reflect.deleteProperty(config, 'navigationStyle')
      Reflect.set(config, 'transparentTitle', 'none')
      Reflect.set(config, 'titlePenetrate', 'no')
    }

    Reflect.set(content, 'content', config)
  }
}

module.exports = modifyConfig
