const extend = require('extend')
const { pick } = require('@txjs/shared')

const baseConfigKeys = [
  'smartProgramRoot',
  'appid',
  'compilation-args',
  'compileType',
  'setting',
  'developType',
  'editor',
  'host',
  'preview',
  'publish',
  'swan'
]

const settingConfigKeys = ['urlCheck']

module.exports = (config = {}) => {
  const { projectname, setting = {}, ...partial } = pick(config, baseConfigKeys, true)

  return extend(partial, {
    host: projectname,
    setting: pick(setting, settingConfigKeys, true)
  })
}
