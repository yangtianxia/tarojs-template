const taroConfigMap = {
  weapp: 'project.config.json',
  swan: 'project.swan.json',
  tt: 'project.tt.json',
  qq: 'project.qq.json',
  alipay: 'project.alipay.json',
  lark: 'project.lark.json'
}

const miniConfigMap = {
  weapp: 'project.config.json',
  swan: 'project.config.json',
  tt: 'project.config.json',
  qq: 'project.config.json',
  alipay: 'mini.project.json',
  lark: 'project.config.json'
}

const envMap = {
  APP_ID: 'appid'
}

module.exports = {
  taroConfigMap,
  miniConfigMap,
  envMap
}
