const { isNil } = require('@txjs/bool')
const { getCurrentTaroEnv, getCurrentModeEnv } = require('../utils/cli')

/**
 * @param callback {(ctx: import('@tarojs/service').IPluginContext, options: Record<string, any>) => void}
 */
function definePlugin(callback) {
  const taroEnv = getCurrentTaroEnv()
  const modeEnv = getCurrentModeEnv()

  if (isNil(taroEnv) || taroEnv === 'h5') {
    return
  }

  return (ctx, options) => {
    ctx.taroEnv = taroEnv
    ctx.modeEnv = modeEnv
    callback.apply(null, [ctx, options])
  }
}

module.exports = definePlugin
