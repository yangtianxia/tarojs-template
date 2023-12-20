const fs = require('fs')
const definePlugin = require('../define-plugin')

module.exports = definePlugin((...args) => {
  if (fs.existsSync(`./${ctx.taroEnv}/index.js`)) {
    require(`./${ctx.taroEnv}`)(...args)
  }
})
