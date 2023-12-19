const shell = require('shelljs')
const { json2ts } = require('json-ts')
const { resolve } = require('../utils/basic')

const outputPath = resolve('dist/types')

function toDTS(...args) {
  if (shell.test('-e', outputPath)) {
    shell.rm('-r', outputPath)
  }

  const env = args.reduce((obj, cur) => {
    for (const key in cur) {
      const value = Reflect.get(cur, key)
      Reflect.set(obj, key, value)
    }
    return obj
  }, {})

  shell.mkdir('-p', outputPath)
  shell.ShellString(
    `declare global {
      namespace NodeJS {
        ${json2ts(JSON.stringify(env), {
          prefix: '',
          rootName: 'ProcessEnv'
        })}
      }
    }
    export {}`
  ).to(
    resolve(outputPath, 'env.d.ts')
  )
}

module.exports = toDTS
