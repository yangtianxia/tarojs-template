const extend = require('extend')
const dts = require('./dts')
const { loadEnv, generateEnvName, isValidEnv, cleanEnvValue } = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx, options = {}) => {
  ctx.modifyWebpackChain(({ chain }) => {
    const env = loadEnv()
    const prefix = Reflect.get(env, 'PREFIX')

    if (isValidEnv(prefix)) {
      chain.module
        .rule('less')
        .oneOf('2')
        .use('3')
        .tap((option) => {
          option ??= {}
          option.lessOptions ??= {}
          option.lessOptions.modifyVars = extend(true, {
            '@prefix': cleanEnvValue(prefix)
          }, options.lessVars)
          return option
        })
        .end()
    }

    chain.plugin('definePlugin')
      .tap((args) => {
        Object.assign(args[0], Object
          .keys(env)
          .reduce(
            (obj, key) => {
              const value = Reflect.get(env, key)
                Reflect.set(obj, generateEnvName(key), value)
              return obj
            }, {}
          )
        )
        return args
      })
      .end()
  })

  ctx.onBuildFinish(() => dts(loadEnv()))
}
