const { getCurrentTaroEnv } = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  const taroEnv = getCurrentTaroEnv()

  if (taroEnv !== 'alipay') return

  ctx.modifyBuildAssets(({ assets }) => {
    for (const key in assets) {
      if (key.startsWith('custom-tab-bar')) {
        const newKey = key.replace(/^custom-tab-bar/i, 'customize-tab-bar')
        Reflect.set(assets, newKey, assets[key])
        Reflect.deleteProperty(assets, key)
      }
    }
  })
}
