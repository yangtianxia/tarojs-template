const path = require('path')
const shell = require('shelljs')
const webpack = require('webpack')
const cleanCss = require('clean-css')
const { isArray, isPlainObject, isString } = require('@txjs/bool')
const { getCurrentTaroEnv, isTruly, resolve } = require('../utils')
const { generateTheme } = require('./utils')

const pollenConfig = path.resolve(__dirname, 'config.js')
const pollenCssPath = resolve('node_modules/pollen-css/pollen.css')

const { RawSource } = webpack.sources

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  const isWeapp = getCurrentTaroEnv() === 'weapp'
  let used = false

  function generateThemeOutput() {
    if (shell.test('-e', pollenConfig)) {
      shell.exec(`pollen --config ${pollenConfig}`)
    }

    if (isWeapp && isTruly(process.env.DARKMODE)) {
      const config = JSON.stringify(generateTheme(), null, 2)
      const output = resolve(ctx.paths.outputPath, 'theme.json')
      shell.ShellString(config).to(output)
    }

    shell.echo('✨ [taro-theme] build finish')
  }

  function formatMiniConfigField(config, constants) {
    for (const key in config) {
      const value = Reflect.get(config, key)
      if (isPlainObject(value)) {
        formatMiniConfigField(value, constants)
      } else if (isArray(value)) {
        for (let i = 0, len = value.length; i < len; i++) {
          const item = value[i]
          if (isPlainObject(item) || isArray(item)) {
            formatMiniConfigField(item, constants)
          }
        }
      } else if (isString(value)) {
        const foundAt = value.indexOf('@')

        if (foundAt === 0) {
          const result = value.slice(1)

          if (Reflect.has(constants, result)) {
            Reflect.set(config, key, Reflect.get(constants, result))
          }
        }
      }
    }
    return config
  }

  // 延迟任务执行，等待taro生成完项目
  ctx.onBuildStart(() => setTimeout(generateThemeOutput, 1))

  ctx.modifyMiniConfigs(({ configMap }) => {
    if (isWeapp && isTruly(process.env.DARKMODE)) {
      // app.config.ts
      if (Reflect.has(configMap, 'app.config')) {
        const appConfig = Reflect.get(configMap, 'app.config')
        const config = Reflect.get(appConfig, 'content')

        // 开启weapp暗黑模式配置
        Reflect.set(config, 'darkmode', true)
        Reflect.set(config, 'themeLocation', 'theme.json')
        Reflect.set(appConfig, 'content', config)
      }
    } else {
      const constants = generateTheme()
      for (const key in configMap) {
        const pageConfig = Reflect.get(configMap, key)
        const config = Reflect.get(pageConfig, 'content')

        // 将weapp暗黑模式配置的变量，重新改为默认配置原始值
        formatMiniConfigField(config, constants.light)
        Reflect.set(pageConfig, config)
      }
    }
  })

  ctx.modifyBuildAssets(({ assets }) => {
    for (const path in assets) {
      // 将css公共变量文件内容插入到app.*ss样式文件头部
      if (/^app\.(.+)ss$/.test(path)) {
        if (shell.test('-e', pollenCssPath)) {
          const source = shell.cat(pollenCssPath).toString()
          const output = new cleanCss().minify(source)
          const content = Reflect.get(assets, path)
          Reflect.set(assets, path, new RawSource(`${`/**CSS-START*/${output.styles}/**CSS-END*/\n`}${content.source()}`))
        }
        break
      }
    }
  })

  ctx.onBuildFinish(() => {
    if (used) {
      generateThemeOutput()
    }
    used = true
  })
}
