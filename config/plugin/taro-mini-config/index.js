const shell = require('shelljs')
const extend = require('extend')
const fs = require('fs-extra')
const { isNil } = require('@txjs/bool')
const { getCurrentTaroEnv, resolve, loadEnv, cleanEnvValue, toJSON } = require('../utils')
const { miniConfigMap, envMap } = require('./utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx, option = {}) => {
  const taroEnv = getCurrentTaroEnv()

  if (isNil(taroEnv) || taroEnv === 'h5') return

  const run = require(`./${taroEnv}`)
  const projectConfigName = Reflect.get(miniConfigMap, taroEnv)
  const outputPath = resolve(ctx.paths.outputPath, projectConfigName)
  const dynamicOption = Reflect.get(option, taroEnv) || {}
  const sourceRoot = Reflect.get(option, 'sourceRoot')
  const globalOption = Reflect.get(option, 'global') || {}

  async function copyConfig() {
    const formRoot = resolve(sourceRoot, taroEnv)

    if (shell.test('-d', formRoot)) {
      await fs.copy(formRoot, ctx.paths.outputPath)
    }
  }

  ctx.onBuildFinish(async () => {
    // 先拷贝项目初始配置
    await copyConfig()

    if (!shell.test('-e', outputPath)) return

    const env = loadEnv()
    const partial = Object
      .keys(env)
      .reduce(
        (obj, key) => {
          if (Reflect.has(envMap, key)) {
            const newKey = Reflect.get(envMap, key)
            const value = Reflect.get(env, key)
            Reflect.set(obj, newKey, cleanEnvValue(value))
          }
          return obj
        }, {}
      )

    try {
      const temp = shell.cat(outputPath)
      const projectConfig = toJSON(temp)
      const config = extend(true, partial, globalOption, dynamicOption)
      const extraConfig = run?.(config)
      const usedConfig = extend(true, projectConfig, extraConfig)
      shell.ShellString(JSON.stringify(usedConfig)).to(outputPath)
    } catch (err) {
      console.log('❌', err)
    }
  })
}
