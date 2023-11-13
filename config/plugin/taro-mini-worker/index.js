const shell = require('shelljs')
const rollup = require('rollup')
const json = require('@rollup/plugin-json')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const { isNil } = require('@txjs/bool')
const { getCurrentTaroEnv, resolve } = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  const taroEnv = getCurrentTaroEnv()
  const workersFrom = resolve('src/workers', 'index.ts')

  if (isNil(taroEnv) && !shell.test('-e', workersFrom)) return

  const rollupBaseConfig = {
    input: workersFrom,
    output: {
      file: resolve(ctx.paths.outputPath, 'workers/index.js'),
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
          'src/workers/index.ts',
          'types/workers.d.ts',
        ]
      })
    ]
  }

  async function rollupBuild() {
    if (process.env.NODE_ENV === 'development') {
      const watcher = await rollup.watch({
        ...rollupBaseConfig,
        watch: {
          exclude: ['node_modules/**'],
          include: [workersFrom],
        }
      })

      watcher.on('change', () => {
        shell.echo('🚀 [taro-mini-worker] changed')
      })
    } else {
      const result = await rollup.rollup(
        rollupBaseConfig
      )

      await result.write(
        rollupBaseConfig.output
      )
    }

    shell.echo('✨ [taro-mini-worker] build finish')
  }

  ctx.onBuildStart(() => setTimeout(rollupBuild, 1))

  ctx.modifyMiniConfigs(({ configMap }) => {
    if (Reflect.has(configMap, 'app.config')) {
      const appConfig = Reflect.get(configMap, 'app.config')
      const config = Reflect.get(appConfig, 'content')

      // 开启workers配置
      Reflect.set(config, 'workers', 'workers')
      Reflect.set(appConfig, 'content', config)
    }
  })
}
