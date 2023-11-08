const path = require('path')
const minimist = require('minimist')
const dotenv = require('dotenv')
const extend = require('extend')
const { isNil, notNil } = require('@txjs/bool')

const ciArgs = minimist(process.argv.slice(2), {
  type: 'type',
  string: 'mode'
})

function resolve(...dir) {
  return path.resolve(process.cwd(), ...dir)
}

function getCurrentModeEnv() {
  return notNil(ciArgs.mode) ? ciArgs.mode : process.env.NODE_ENV
}

function getCurrentTaroEnv() {
  return notNil(ciArgs.type) ? ciArgs.type : process.env.TARO_ENV
}

function parseEnv(value, env) {
  if (value.startsWith('@')) {
    const name = value.replace(/^@/, '')

    if (Reflect.has(env, name)) {
      value = Reflect.get(env, name)
    }
  }
  return JSON.stringify(value)
}

function cleanEnvKey(value) {
  return notNil(value) ? value.replace(/^process\.env\./, '') : ''
}

function cleanEnvValue(value) {
  return notNil(value) ? JSON.parse(value) : ''
}

function generateEnvName(value) {
  return notNil(value) ? `process.env.${value}` : ''
}

function isValidEnv(value) {
  return value != null && value != '""'
}

function isTruly(value) {
  return isValidEnv(value) ? /^true/i.test(value) : false
}

function loadEnv() {
  const modeEnv = getCurrentModeEnv()
  const taroEnv = getCurrentTaroEnv()
  const directory = '.env'
  const globalConfig = dotenv.config({
    path: resolve(directory)
  })
  const modeEnvConfig = dotenv.config({
    path: resolve(`${directory}.${modeEnv}`)
  })
  const taroEnvConfig = dotenv.config({
    path: resolve(`${directory}.${taroEnv}`)
  })
  const localGlobalConfig = dotenv.config({
    path: resolve(`${directory}.local`)
  })
  const localModeEnvConfig = dotenv.config({
    path: resolve(`${directory}.${modeEnv}.local`)
  })
  const localTaroEnvConfig = dotenv.config({
    path: resolve(`${directory}.${taroEnv}.local`)
  })

  const env = {}

  extend(
    true,
    env,
    // 全局环境
    !globalConfig.error && globalConfig.parsed,
    // 开发环境
    !modeEnvConfig.error && modeEnvConfig.parsed,
    // 小程序环境
    !taroEnvConfig.error && taroEnvConfig.parsed,
    // 本地全局环境
    !localGlobalConfig.error && localGlobalConfig.parsed,
    // 本地开发环境
    !localModeEnvConfig.error && localModeEnvConfig.parsed,
    // 本地小程序环境
    !localTaroEnvConfig.error && localTaroEnvConfig.parsed,
  )

  return Object
    .keys(env)
    .reduce(
      (obj, key) => {
        const value = parseEnv(Reflect.get(env, key), env)
        Reflect.set(env, key, JSON.parse(value))
        Reflect.set(obj, key, value)
        return obj
      }, {}
    )
}

function toJSON(temp) {
  if (isNil(temp)) {
    throw new Error('temp cannot be empty')
  }

  try {
    return JSON.parse(temp)
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  resolve,
  getCurrentModeEnv,
  getCurrentTaroEnv,
  cleanEnvKey,
  cleanEnvValue,
  generateEnvName,
  isValidEnv,
  isTruly,
  loadEnv,
  toJSON
}
