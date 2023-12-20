const fs = require('fs')
const extend = require('extend')
const { cloneDeep } = require('@txjs/shared')
const { isPlainObject } = require('@txjs/bool')
const { getCurrentTaroEnv } = require('../../utils/cli')
const { camelCase } = require('../../utils/basic')
const theme = require('./default')

const taroEnv = getCurrentTaroEnv()

function getCurrentTheme() {
  // 合并主题
  if (fs.existsSync(`./${taroEnv}/index.js`)) {
    const taroTheme = require(`./${taroEnv}`)

    if (isPlainObject(taroTheme)) {
      extend(true, theme, taroTheme)
    }
  }
  // 避免污染
  return cloneDeep(theme)
}

function getThemeColor() {
  const { light, dark } = getCurrentTheme()
  const darkColor = extend(true, {}, light.color, dark.color)
  const modules = {}
  Reflect.set(modules, 'light', camelCase(light.color))
  Reflect.set(modules, 'dark', camelCase(darkColor))
  return modules
}

module.exports = {
  getCurrentTheme,
  getThemeColor
}
