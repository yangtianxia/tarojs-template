const path = require('path')
const shell = require('shelljs')
const { isNil } = require('@txjs/bool')
const { getCurrentTaroEnv } = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  const taroEnv = getCurrentTaroEnv()

  if (
    isNil(taroEnv) ||
    taroEnv === 'h5' ||
    !shell.test('-d', path.resolve(__dirname, taroEnv))
  ) return

  const run = require(`./${taroEnv}`)

  ctx.modifyMiniConfigs(run)
}
