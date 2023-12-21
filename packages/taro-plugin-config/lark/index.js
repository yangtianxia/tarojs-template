const extend = require('extend')
const { pick } = require('@txjs/shared')

const baseConfigKeys = [
  'miniprogramRoot',
  'setting',
  'appid',
  'projectname'
]

const settingConfigKeys = [
  'es6',
  'minified',
  'babelSetting'
]

module.exports = (config = {}) => {
  const { setting = {}, ...partial } = pick(config, baseConfigKeys, true)

  return extend(partial, {
    setting: pick(setting, settingConfigKeys, true)
  })
}
