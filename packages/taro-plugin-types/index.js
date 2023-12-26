const shell = require('shelljs')
const definePlugin = require('../define-plugin')
const { isPlainObject } = require('@txjs/bool')
const { resolve } = require('../utils/basic')
const env = require('./env')
const icons = require('./icons')

const outputPath = resolve('dist/types')

module.exports = definePlugin((ctx) => {
  if (shell.test('-e', outputPath)) {
    shell.rm('-r', outputPath)
  }

  shell.mkdir('-p', outputPath)

  const generates = [env(), icons()]
    .filter((item) => isPlainObject(item))
    .map((item) => () => {
      shell.ShellString(
        item.sourceString
      )
      .to(
        resolve(outputPath, item.path)
      )
    })

  ctx.onBuildFinish(() => generates.forEach((fn) => fn()))
})
