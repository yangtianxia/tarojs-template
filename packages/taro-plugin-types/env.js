const { json2ts } = require('json-ts')
const envUtils = require('../utils/env-utils')

function generate() {
  return {
    path: 'env.d.ts',
    sourceString: `declare global {
      namespace NodeJS {
        ${json2ts(
          JSON.stringify(envUtils.loadEnv()), {
          prefix: '',
          rootName: 'ProcessEnv'
        })}
      }
    }
    export {}`
  }
}

module.exports = generate
