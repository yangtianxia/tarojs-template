const path = require('path')
const shell = require('shelljs')
const rollup = require('rollup')
const json = require('@rollup/plugin-json')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const { shallowMerge } = require('@txjs/shared')
const definePlugin = require('../define-plugin')
const { resolve } = require('../utils/basic')

const defaultOptions = {
  enterPath: 'scr/worker/index.ts',
  outputPath: 'worker/index.js'
}

module.exports = definePlugin((ctx, options) => {
  options = shallowMerge({}, defaultOptions, options)

  const sourcePath = resolve(options.enterPath)
  const outputDir = path.parse(options.outputPath).dir

  if (shell.test('-e', sourcePath)) {
    const baseConfig = {
      input: sourcePath,
      output: {
        file: resolve(ctx.paths.outputPath, options.outputPath),
        format: 'cjs'
      },
      plugins: [
        nodeResolve(),
        json(),
        commonjs(),
        typescript({
          tsconfig: false,
          compilerOptions: {
            sourceMap: false,
            module: 'esnext',
            lib: ['es5', 'es6', 'dom']
          },
          include: [
            options.enterPath,
            'types/workers.d.ts',
          ]
        })
      ]
    }

    async function buildWorker() {
      if (process.env.NODE_ENV === 'development') {
        const watcher = await rollup.watch({
          ...baseConfig,
          watch: {
            exclude: ['node_modules/**'],
            include: [sourcePath],
          }
        })

        watcher.on('change', () => {
          shell.echo('🚀 [taro-plugin-worker] changed')
        })
      } else {
        const result = await rollup.rollup(
          baseConfig
        )

        await result.write(
          baseConfig.output
        )
      }

      shell.echo('✨ [taro-plugin-worker] build finish')
    }

    ctx.onBuildStart(() => setTimeout(buildWorker, 1))

    ctx.modifyMiniConfigs(({ configMap }) => {
      if (Reflect.has(configMap, 'app.config')) {
        const appConfig = Reflect.get(configMap, 'app.config')
        const config = Reflect.get(appConfig, 'content')

        // 开启 workers 配置
        Reflect.set(config, 'workers', outputDir)
        Reflect.set(appConfig, 'content', config)
      }
    })
  }
})
