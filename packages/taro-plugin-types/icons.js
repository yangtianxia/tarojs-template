const shell = require('shelljs')

const ClassMatch = /\.van-icon-(.+):before\s+{\n.+\n}/ig

function generate() {
  if (shell.exec('npm list @vant/icons').code === 0) {
    const temp = shell.cat('node_modules/@vant/icons/src/common.less')
    const result = []

    temp
      .toString()
      .replaceAll(
        ClassMatch,
        (_, $1) => result.push(`'${$1}'`)
      )

    return {
      path: 'icons.d.ts',
      sourceString: `declare global {
        type IconTypes = ${result.join(' | ')}
      }
      export {}
      `
    }
  }
}

module.exports = generate
