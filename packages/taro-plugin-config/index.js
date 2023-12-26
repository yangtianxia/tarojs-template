const fs = require('fs-extra')
const shell = require('shelljs')
const extend = require('extend')
const definePlugin = require('../define-plugin')
const { resolve, toJSON } = require('../utils/basic')
const envUtils = require('../utils/env-utils')
const { outputFileNameMap, globalFieldMap } = require('./utils')

module.exports = definePlugin((ctx, options = {}) => {
  let copied = false
  let mergedFilter = function(config) { return config }

  if (fs.existsSync(`./${ctx.taroEnv}/index.js`)) {
    mergedFilter = require(`./${ctx.taroEnv}`)
  }

  const fileName = Reflect.get(outputFileNameMap, ctx.taroEnv)
  const outputPath = resolve(ctx.paths.outputPath, fileName)

  // 默认文件目录
  const sourceRoot = Reflect.get(options, 'sourceRoot')

  // 目标小程序私有配置
  const dynamicConfig = Reflect.get(options, ctx.taroEnv)
  // 所有小程序共享配置
  const globalConfig = Reflect.get(options, 'global')

  function merged() {
    // 配置文件不存在
    // 创建一个空文件
    if (!shell.test('-e', outputPath)) {
      shell.touch(outputPath)
      fs.writeFileSync(outputPath, '{}')
    }

    const env = envUtils.loadEnv()
    const partialEnv = envUtils.filter(env, (key, value) => {
      if (Reflect.has(globalFieldMap, key)) {
        const newKey = Reflect.get(globalFieldMap, key)
        return { [newKey]: envUtils.cleanValue(value) }
      }
    })

    try {
      // 当前小程序配置
      const temp = shell.cat(outputPath)
      const tempConfig = toJSON(temp)
      // 自定义额外配置
      const extraConfig = extend(true, partialEnv, globalConfig, dynamicConfig)
      const usedConfig = extend(true, tempConfig, mergedFilter(extraConfig, ctx))

      shell.ShellString(
        JSON.stringify(usedConfig, null, 2)
      ).to(
        outputPath
      )
    } catch (err) {
      console.log('❌', '[taro-plugin-config]', err)
    }
  }

  ctx.modifyMiniConfigs(({ configMap }) => {
    if (ctx.taroEnv === 'alipay') {
      require('./alipay/modify-config')(configMap)
    }
  })

  ctx.onBuildFinish(() => {
    if (copied) {
      merged()
    }
  })

  ctx.onBuildComplete(async () => {
    const taroConfigDir = resolve(sourceRoot, ctx.taroEnv)

    // 当前小程序配置是否存在
    if (shell.test('-d', taroConfigDir)) {
      await fs.copy(taroConfigDir, ctx.paths.outputPath, {
        overwrite: true
      })
    }
    merged()
    copied = true
  })
})
