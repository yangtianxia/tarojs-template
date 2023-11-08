const shell = require('shelljs')
const fs = require('fs-extra')
const { isNil } = require('@txjs/bool')
const { getCurrentTaroEnv } = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx, options = {}) => {
  const taroEnv = getCurrentTaroEnv()
  const copyOption = Reflect.get(options, taroEnv)

  if (isNil(copyOption)) return

  ctx.onBuildFinish(async () => {
    if (shell.test('-d', copyOption.from)) {
      await fs.copy(copyOption.from, ctx.paths.outputPath)
    }
  })
}
