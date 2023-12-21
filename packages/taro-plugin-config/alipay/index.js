const extend = require('extend')
const { pick } = require('@txjs/shared')

const baseConfigKeys = [
  'format',
  'compileType',
  'miniprogramRoot',
  'pluginRoot',
  'compileOptions',
  'uploadExclude',
  'assetsInclude',
  'developOptions',
  'pluginResolution',
  'scripts'
]

const compileOptionKeys = [
  'component2',
  'typescript',
  'less',
  'treeShaking',
  'resolveAlias',
  'globalObjectMode',
  'transpile'
]

module.exports = (config = {}) => {
  const { compileOptions = {}, ...partial } = pick(config, baseConfigKeys, true)

  return extend(partial, {
    compileOptions: pick(compileOptions, compileOptionKeys, true)
  })
}
