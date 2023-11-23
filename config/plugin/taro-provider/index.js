const { resolve } = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  ctx.modifyWebpackChain(({ chain }) => {
    chain
      .plugin('providerPlugin')
      .tap((args) => {
        args[0].BEM = [resolve('src/shared/provide/bem.ts'), 'default']
        args[0].mitt = [resolve('src/shared/provide/mitt.ts'), 'default']
        args[0].toast = [resolve('src/shared/provide/toast.ts'), 'default']
        args[0].modal = [resolve('src/shared/provide/modal.ts'), 'default']
        return args
      })
  })
}
