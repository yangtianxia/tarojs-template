const { isNil } = require('@txjs/bool')
const { getCurrentTaroEnv } = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  const taroEnv = getCurrentTaroEnv()

  if (isNil(taroEnv) || taroEnv === 'h5') return

  const run = require(`./${taroEnv}`)

  ctx.modifyMiniConfigs(({ configMap }) => {
    run?.({ configMap })
  })
}
