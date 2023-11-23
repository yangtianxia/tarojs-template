const shell = require('shelljs')
const extend = require('extend')
const { isNil } = require('@txjs/bool')
const { toArray } = require('@txjs/shared')
const { getCurrentModeEnv, getCurrentTaroEnv, resolve, toJSON } = require('../utils')
const { miniFieldKeys, miniConfigMap } = require('./utils')

const defaultOption = {
  targetPath: 'compile.config.js'
}

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx, option = {}) => {
  const taroEnv = getCurrentTaroEnv()

  if (isNil(taroEnv) || taroEnv === 'h5') return

  option = extend(defaultOption, option)

  const modeEnv = getCurrentModeEnv()
  const configPath = resolve(option.targetPath)
  const outputDir = resolve(ctx.paths.outputPath)
  const outputPath = Reflect.get(miniConfigMap, taroEnv)
  const fieldKeys = Reflect.get(miniFieldKeys, taroEnv)

  function checkOutputFolder(path) {
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

  function generateCompiles(compiles) {
    compiles = compiles.filter((item) => {
      const notMode = isNil(item.mode)
      const notTaro = isNil(item.taro)

      if (notMode && notTaro) {
        return true
      }

      const mode = []
      const taro = []

      if (notMode) {
        mode.push('*')
      } else {
        mode.push(
          ...toArray(item.mode)
        )
      }

      if (notTaro) {
        taro.push('*')
      } else {
        mode.push(
          ...toArray(item.taro)
        )
      }

      return (mode.includes('*') || mode.includes(modeEnv)) && (taro.includes('*') || taro.includes(taroEnv))
    })
    .map((item) => ({
      [Reflect.get(fieldKeys, 'title')]: item.title,
      [Reflect.get(fieldKeys, 'page')]: item.page,
      [Reflect.get(fieldKeys, 'query')]: item.query,
      [Reflect.get(fieldKeys, 'launchMode')]: item.launchMode,
      [Reflect.get(fieldKeys, 'scene')]: item.scene
    }))

    switch (taroEnv) {
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

  ctx.onBuildFinish(() => {
    if (shell.test('-e', configPath)) {
      const compiles = require(configPath)
      const compileConfig = generateCompiles(compiles)

      try {
        checkOutputFolder(outputPath)

        let projectConfig = {}

        if (taroEnv !== 'weapp' && taroEnv !== 'qq' && shell.test('-e', outputPath)) {
          const temp = shell.cat(outputPath)
          const tempConfig = toJSON(temp)
          projectConfig = extend(true, projectConfig, tempConfig)
        }

        const usedConfig = extend(true, projectConfig, compileConfig)

        shell.ShellString(
          JSON.stringify(usedConfig)
        ).to(
          resolve(outputDir, outputPath)
        )

        shell.echo('✨ [taro-mini-compile] build finish')
      } catch (err) {
        console.log('❌', err)
      }
    }
  })
}
