const configMap = {
  weapp: 'project.config.json',
  swan: 'project.swan.json',
  tt: 'project.tt.json',
  qq: 'project.qq.json',
  alipay: 'project.alipay.json',
  lark: 'project.lark.json'
}

const outputMap = {
  weapp: 'project.config.json',
  swan: 'project.config.json',
  tt: 'project.config.json',
  qq: 'project.config.json',
  alipay: 'mini.project.json',
  lark: 'project.config.json'
}

const universalMap = {
  APP_ID: 'appid'
}

module.exports = {
  configMap,
  outputMap,
  universalMap
}
