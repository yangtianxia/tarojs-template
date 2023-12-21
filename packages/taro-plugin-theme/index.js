const shell = require('shelljs')
const webpack = require('webpack')
const cleanCss = require('clean-css')
const { isString, isPlainObject, isArray } = require('@txjs/bool')
const definPlugin = require('../define-plugin')
const { getThemeColor } = require('./modules')
const envUtils = require('../utils/env-utils')
const { pathResolve, resolve } = require('../utils/basic')

const pollenConfigPath = pathResolve(__dirname, 'pollen.config.js')
const pollenCssFile = resolve('node_modules/pollen-css/pollen.css')

const { RawSource } = webpack.sources

function formatMiniConfig(config, constants) {
  for (const key in config) {
    const value = Reflect.get(config, key)

    if (isPlainObject(value)) {
      formatMiniConfig(value, constants)
    } else if (isArray(value)) {
      for (let i = 0, len = value.length; i < len; i++) {
        const item = value[i]

        if (isPlainObject(item) || isArray(item)) {
          formatMiniConfig(item, constants)
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
}

module.exports = definPlugin((ctx) => {
  const isWeapp = ctx.taroEnv === 'weapp'
  let packed = false

  function buildThemeOutput() {
    if (shell.test('-e', pollenConfigPath)) {
      shell.exec(`pollen --config ${pollenConfigPath}`)
    }

    // 微信小程序 theme 配置
    if (isWeapp && envUtils.isTruly(process.env.DARKMODE)) {
      const theme = JSON.stringify(getThemeColor(), null, 2)
      const outputPath = resolve(ctx.paths.outputPath, 'theme.json')
      shell.ShellString(theme).to(outputPath)
    }

    shell.echo('✨ [taro-plugin-theme] build finish')
  }

  ctx.modifyMiniConfigs(({ configMap }) => {
    if (isWeapp && envUtils.isTruly(process.env.DARKMODE)) {
      if (Reflect.has(configMap, 'app.config')) {
        const content = Reflect.get(configMap, 'app.config')
        const appConfig = Reflect.get(content, 'content')

        // 启用微信小程序暗黑模式配置
        Reflect.set(appConfig, 'darkmode', true)
        Reflect.set(appConfig, 'themeLocation', 'theme.json')
        Reflect.set(content, 'content', appConfig)
      }
    } else {
      const theme = getThemeColor()
      Object.keys(configMap).forEach((key) => {
        const content = Reflect.get(configMap, key)
        const pageConfig = Reflect.get(content, 'content')

        // 将暗黑模式配置的变量
        // 重新改为默认配置原始值
        formatMiniConfig(pageConfig, theme.light)
        Reflect.set(content, 'content', pageConfig)
      })
    }
  })

  ctx.modifyBuildAssets(({ assets }) => {
    for (const path in assets) {
      // 把 vars 文件内容插入到 app.*ss 样式文件头部
      if (/^app\.(.+)ss$/.test(path)) {
        if (shell.test('-e', pollenCssFile)) {
          const source = shell.cat(pollenCssFile).toString()
          const output = new cleanCss().minify(source)
          const content = Reflect.get(assets, path)
          const newContent = `${`/**CSS-START*/${output.styles}/**CSS-END*/\n`}${content.source()}`
          Reflect.set(assets, path, new RawSource(newContent))
        }
        break
      }
    }
  })

  ctx.onBuildStart(() => setTimeout(buildThemeOutput, 1))

  ctx.onBuildFinish(() => {
    if (packed) {
      buildThemeOutput()
    }
    packed = true
  })
})
