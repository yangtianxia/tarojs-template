const configFieldMap = {
  weapp: {
    title: 'name',
    page: 'pathName',
    query: 'query',
    launchMode: 'launchMode',
    scene: 'scene',
    extraInfo: 'referrerInfo'
  },
  alipay: {
    title: 'title',
    page: 'page',
    query: 'pageQuery',
    launchMode: 'launchMode',
    scene: 'scene'
  },
  tt: {
    title: 'name',
    page: 'pathName',
    query: 'query',
    launchMode: 'launchFrom',
    scene: 'scene'
  },
  qq: {
    title: 'name',
    page: 'pathName',
    query: 'query',
    launchMode: 'launchMode',
    scene: 'scene'
  },
  lark: {
    title: 'name',
    page: 'pathName',
    query: 'query',
    launchMode: 'launchFrom',
    scene: 'scene'
  },
  swan: {}
}

const outputFileMap = {
  weapp: 'project.private.config.json',
  qq: 'project.private.config.json',
  alipay: '.mini-ide/compileMode.json',
  tt: 'project.private.config.json',
  swan: 'project.swan.json',
  lark: 'project.config.json'
}

module.exports = {
  configFieldMap,
  outputFileMap
}
