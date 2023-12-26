const dotenv = require('dotenv')
const extend = require('extend')
const { shallowMerge } = require('@txjs/shared')
const { notNil, isPlainObject } = require('@txjs/bool')
const { resolve } = require('./basic')
const { getCurrentModeEnv, getCurrentTaroEnv } = require('./cli')

class EnvUtils {
  __PREFIX = 't'
  __DIRECTORY = '.env'

  constructor () {}

  __pathSplicing(...args) {
    return resolve([this.__DIRECTORY, ...args].join('.'))
  }

  loadEnv() {
    const modeEnv = getCurrentModeEnv()
    const taroEnv = getCurrentTaroEnv()

    const globalConfig = dotenv.config({
      path: this.__pathSplicing()
    })
    const modeEnvConfig = dotenv.config({
      path: this.__pathSplicing(modeEnv)
    })
    const taroEnvConfig = dotenv.config({
      path: this.__pathSplicing(taroEnv)
    })
    const localGlobalConfig = dotenv.config({
      path: this.__pathSplicing('local')
    })
    const localModeEnvConfig = dotenv.config({
      path: this.__pathSplicing(modeEnv, 'local')
    })
    const localTaroEnvConfig = dotenv.config({
      path: this.__pathSplicing(taroEnv, 'local')
    })

    const sourceEnv = {
      PREFIX: this.__PREFIX
    }

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
        const value = this.parse(Reflect.get(sourceEnv, key), sourceEnv)
        Reflect.set(sourceEnv, key, JSON.parse(value))
        Reflect.set(env, key, value)
        return env
      }, {})
  }

  parse(value, sourceEnv) {
    if (value.startsWith('@')) {
      const keys = value.split('@')
      value = keys
        .reduce((chunks, key) => {
          if (Reflect.has(sourceEnv, key)) {
            chunks.push(Reflect.get(sourceEnv, key))
          }
          return chunks
        }, [])
        .join('')
    }
    return JSON.stringify(value)
  }

  filter(sourceEnv, callback) {
    const newObj = {}
    const keys = Object.keys(sourceEnv)
    let i = 0

    while (keys.length) {
      const key = keys.shift()
      const value = Reflect.get(sourceEnv, key)
      const result = callback(key, value, i)

      if (result === true) {
        Reflect.set(newObj, key, value)
      } else if (isPlainObject(result)) {
        shallowMerge(newObj, result)
      }

      i++
    }
  }

  toName(value) {
    return notNil(value) ? `process.env.${value}` : ''
  }

  cleanKey(value) {
    return notNil(value) ? value.replace(/^process\.env\./, '') : ''
  }

  cleanValue(value) {
    return notNil(value) ? JSON.parse(value) : ''
  }

  isValid(value) {
    return value != null && value != '""'
  }

  isTruly(value) {
    return this.isValid(value) ? /^true$/i.test(value) : false
  }
}

module.exports = new EnvUtils()
