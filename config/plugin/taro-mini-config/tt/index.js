const extend = require('extend')
const { pick } = require('@txjs/shared')

const baseConfigKeys = [
  'appid',
  'miniprogramRoot',
  'setting',
  'projectname'
]

const settingConfigKeys = [
  'es6',
  'urlCheck',
  'autoCompile',
  'mockUpdate',
  'scripts',
  'mockLogin'
]

module.exports = (config = {}) => {
  const { setting = {}, ...partial }  = pick(config, baseConfigKeys, true)

  return extend(partial, {
    setting: pick(setting, settingConfigKeys, true)
  })
}
