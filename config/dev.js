const minimist = require('minimist')

const plugins = []
const ciArgs = minimist(process.argv.slice(2), {
  boolean: 'debug',
  boolean: 'mock'
})

if (ciArgs.debug) {
  plugins.push('@tarojs/plugin-vue-devtools')
}

if (ciArgs.mock) {
  plugins.push('@tarojs/plugin-mock')
}

module.exports = {
  plugins,
  env: {
    NODE_ENV: JSON.stringify('development')
  }
}
