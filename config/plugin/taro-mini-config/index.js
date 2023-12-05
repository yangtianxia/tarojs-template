const path = require('path')
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
  let isComplete = false

  if (
    isNil(taroEnv) ||
    taroEnv === 'h5' ||
    !shell.test('-d', path.resolve(__dirname, taroEnv))
  ) return

  const run = require(`./${taroEnv}`)
  const projectConfigName = Reflect.get(miniConfigMap, taroEnv)
  const outputPath = resolve(ctx.paths.outputPath, projectConfigName)
  const dynamicOption = Reflect.get(option, taroEnv) || {}
  const sourceRoot = Reflect.get(option, 'sourceRoot')
  const globalOption = Reflect.get(option, 'global') || {}

  const merged = () => {
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
      const projectConfig = toJSON(
        shell.cat(outputPath)
      )
      const extraConfig = run(
        extend(true, partial, globalOption, dynamicOption)
      )
      const usedConfig = extend(true, projectConfig, extraConfig)
      shell.ShellString(JSON.stringify(usedConfig)).to(outputPath)
    } catch (err) {
      console.log('❌', err)
    }
  }

  ctx.onBuildFinish(() => {
    if (isComplete) {
      merged()
    }
  })

  ctx.onBuildComplete(async () => {
    const fromRoot = resolve(sourceRoot, taroEnv)

    if (shell.test('-d', fromRoot)) {
      await fs.copy(fromRoot, ctx.paths.outputPath, {
        overwrite: true
      })
      merged()
    }
    isComplete = true
  })
}
