const shell = require('shelljs')
const extend = require('extend')
const definePlugin = require('../define-plugin')
const { isNil } = require('@txjs/bool')
const { toArray } = require('@txjs/shared')
const { resolve, toJSON } = require('../utils/basic')
const { configFieldMap, outputFileMap } = require('./utils')

const defaultPath = 'compile.config.js'

module.exports = definePlugin((ctx, options) => {
  const sourcePath = resolve(options.path || defaultPath)
  const outputDir = resolve(ctx.paths.outputPath)

  const fileName = Reflect.get(outputFileMap, ctx.taroEnv)
  const fieldKey = Reflect.get(configFieldMap, ctx.taroEnv)
  const keys = Object.keys(fieldKey)

  function transform(option) {
    return keys.reduce((obj, key) => {
      obj[fieldKey[key]] = option[key]
      return obj
    }, {})
  }

  function generate(compiles) {
    compiles = compiles.filter((item) => {
      const useMode = isNil(item.mode)
      const useTaro = isNil(item.taro)

      if (useMode && useTaro) {
        return true
      }

      const mode = toArray(useMode ? '*' : item.mode)
      const taro = toArray(useTaro ? '*' : item.taro)

      return (
        mode.includes('*') ||
        mode.includes(ctx.modeEnv)
      ) && (
        taro.includes('*') ||
        taro.includes(ctx.taroEnv)
      )
    })
    .map(transform)

    switch (ctx.taroEnv) {
      case 'alipay':
        return { modes: compiles }
      case 'tt':
      case 'qq':
      case 'weapp':
      case 'lark':
        return {
          condition: {
            miniprogram: { list: compiles }
          }
        }
    }
  }

  function preprocessPath(path) {
    const foundAt = path.lastIndexOf('/')

    if (foundAt > 0) {
      const foundFolder = path.slice(0, foundAt + 1)
      const folderPath = resolve(outputDir, foundFolder)
      if (!shell.test('-d', folderPath)) {
        shell.mkdir('-p', folderPath)
      }
      path = path.slice(0, foundAt)
    }
    return path
  }

  function buildCompile() {
    const sourceConfig = require(sourcePath)
    const compiles = generate(sourceConfig)

    try {
      // 预处理路径
      // 如果是目录，则创建文件夹
      preprocessPath(fileName)

      let config = {}

      // 针对不是私有配置
      if (!['weapp', 'qq', 'tt', 'alipay'].includes(ctx.taroEnv) && shell.test('-e', fileName)) {
        const temp = shell.cat(fileName)
        const tempConfig = toJSON(temp)
        config = extend(true, config, tempConfig)
      }

      const usedConfig = extend(true, config, compiles)

      shell.ShellString(
        JSON.stringify(usedConfig)
      ).to(
        resolve(outputDir, fileName)
      )

      shell.echo('✨ [taro-plugin-compile] build finish')
    } catch (err) {
      console.log('❌', '[taro-plugin-compile]', err)
    }
  }

  ctx.onBuildFinish(() => {
    if (shell.test('-e', sourcePath)) {
      buildCompile()
    }
  })
})
