const minimist = require('minimist')
const { notNil } = require('@txjs/bool')

const ciArgs = minimist(process.argv.slice(2), {
  type: 'type',
  string: 'mode'
})

function getCurrentModeEnv() {
  return notNil(ciArgs.mode) ? ciArgs.mode : process.env.NODE_ENV
}

function getCurrentTaroEnv() {
  return notNil(ciArgs.type) ? ciArgs.type : process.env.TARO_ENV
}

module.exports = {
  getCurrentModeEnv,
  getCurrentTaroEnv
}
