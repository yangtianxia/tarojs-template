const dotenv = require('dotenv')
const extend = require('extend')
const envUtils = require('./env-utils')
const { resolve } = require('./basic')
const { getCurrentModeEnv, getCurrentTaroEnv } = require('./cli')

const DIRECTORY = '.env'

function pathSplicing(...args) {
  return resolve([DIRECTORY, ...args].join('.'))
}

function loadEnv() {
  const modeEnv = getCurrentModeEnv()
  const taroEnv = getCurrentTaroEnv()

  const globalConfig = dotenv.config({
    path: pathSplicing()
  })
  const modeEnvConfig = dotenv.config({
    path: pathSplicing(modeEnv)
  })
  const taroEnvConfig = dotenv.config({
    path: pathSplicing(taroEnv)
  })
  const localGlobalConfig = dotenv.config({
    path: pathSplicing('local')
  })
  const localModeEnvConfig = dotenv.config({
    path: pathSplicing(modeEnv, 'local')
  })
  const localTaroEnvConfig = dotenv.config({
    path: pathSplicing(taroEnv, 'local')
  })

  const sourceEnv = {}

  extend(true, sourceEnv,
    // 全局环境
    !globalConfig.error && globalConfig.parsed,
    // 自定义环境
    !modeEnvConfig.error && modeEnvConfig.parsed,
    // 小程序环境
    !taroEnvConfig.error && taroEnvConfig.parsed,
    // 本地全局环境
    !localGlobalConfig.error && localGlobalConfig.parsed,
    // 本地自定义环境
    !localModeEnvConfig.error && localModeEnvConfig.parsed,
    // 本地小程序环境
    !localTaroEnvConfig.error && localTaroEnvConfig.parsed,
  )

  return Object
    .keys(sourceEnv)
    .reduce((env, key) => {
      const value = envUtils.parse(
        Reflect.get(sourceEnv, key),
        sourceEnv
      )
      Reflect.set(sourceEnv, key, JSON.parse(value))
      Reflect.set(env, key, value)
      return env
    }, {})
}

module.exports = {
  loadEnv
}
