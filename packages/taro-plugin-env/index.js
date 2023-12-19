const extend = require('extend')
const { shallowMerge } = require('@txjs/shared')
const definPlugin = require('../define-plugin')
const toDTS = require('./dts')
const envUtils = require('../utils/env-utils')
const { loadEnv } = require('../utils/env')

module.exports = definPlugin((ctx) => {
  ctx.modifyWebpackChain(({ chain }) => {
    const env = loadEnv()
    const prefix = Reflect.get(env, 'PREFIX')

    if (envUtils.isValid(prefix)) {
      const lessVars = {
        '@prefix': envUtils.cleanValue(prefix)
      }

      chain.module
        .rule('less')
        .oneOf('2')
        .use('3')
        .tap((option) => {
          option ??= {}
          option.lessOptions ??= {}
          option.lessOptions.modifyVars = extend(true, option.lessOptions.modifyVars, lessVars)
          return option
        })
        .end()
    }

    const constants = {}

    for (const key in env) {
      const value = Reflect.get(env, key)
      Reflect.set(constants, envUtils.toName(key), value)
    }

    chain.plugin('definePlugin')
      .tap((args) => {
        shallowMerge(args[0], constants)
        return args
      })
      .end()
  })

  ctx.onBuildFinish(() => toDTS(loadEnv()))
})
