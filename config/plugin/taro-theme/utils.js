const extend = require('extend')
const { camelize } = require('@txjs/shared')
const { isPlainObject } = require('@txjs/bool')
const { light, dark } = require('./modules')

/**
 * 转换成驼峰写法
 */
function convertThemeToken(themes = {}) {
  return Object
    .keys(themes)
    .reduce(
      (obj, key) => {
        let curValue = Reflect.get(themes, key)
        if (isPlainObject(curValue)) {
          curValue = convertThemeToken(curValue)
        }
        Reflect.set(obj, camelize(key), curValue)
        return obj
      }, {}
    )
}

/**
 * - 支持微信小程序暗黑模式
 * - 目前只包含导入color
 */
function generateTheme() {
  const config = {}
  Reflect.set(config, 'light', convertThemeToken(light.color))
  Reflect.set(config, 'dark', convertThemeToken(
    extend(true, {}, light.color, dark.color)
  ))
  return config
}

module.exports = {
  convertThemeToken,
  generateTheme
}
