const { isNil } = require('@txjs/bool')
const { noop } = require('@txjs/shared')
const { getCurrentTaroEnv, getCurrentModeEnv } = require('../utils/cli')

/**
 * @param callback {(ctx: import('@tarojs/service').IPluginContext & Record<'taroEnv' | 'modeEnv', string>, options: Record<string, any>) => void}
 */
function definePlugin(callback) {
  const taroEnv = getCurrentTaroEnv()
  const modeEnv = getCurrentModeEnv()

  if (isNil(taroEnv) || taroEnv === 'h5') {
    return noop
  }

  return (ctx, options) => {
    ctx.taroEnv = taroEnv
    ctx.modeEnv = modeEnv
    callback.apply(null, [ctx, options])
  }
}

module.exports = definePlugin
