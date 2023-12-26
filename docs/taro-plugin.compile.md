## taro-plugin-compile

小程序编译模式插件，配置相关需要快捷编译的页面入口，即可生成相关页面的快捷入口。是一个可以提高效率的插件，有任何问题可以 [issues](https://github.com/yangtianxia/tarojs-template/issues)

### 插件配置
支持在项目根目录添加 `compile.config.js` 文件或者配置插件参数 `path` 设置编译配置文件

- 默认
```ts
tarojs-template
├── ...
├── src
├── compile.config.js
└── package.json
```

- 使用插件设置
```js
{
  plugins: [
    [resolve('packages/taro-plugin-compile'), {
      path: resolve('public/compile.config.js')
    }]
  ]
}
```

### 配置字段

| name | 说明 |
| - | - |
| title | 标题 |
| page | 页面地址 |
| query | 参数 |
| launchMode | 启动模式，可默认设置 `default` |
| scene | 启动小程序的 [场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) |
| extraInfo | 额外配置，微信小程序下对应字段为 `referrerInfo`， 可自定义设置 |
| mode | 配置需要的环境，默认: `*` |
| taro | 配置需要的小程序， 默认: `*` |

### 小程序对应配置字段
目前还没有 `swan` 的相关字段设置，没有找到相关支持文档

```js
{
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
```

### 配置内容

- 基础
```js
module.exports = [
  {
    title: '首页',
    page: 'pages/index/index',
    query: '',
    launchMode: 'default',
    scene: null
  }
]
```

- 指定环境
```js
module.exports = [
  {
    title: '首页',
    page: 'pages/index/index',
    query: '',
    launchMode: 'default',
    scene: null,
    mode: ['development']
  }
]
```

- 指定小程序环境
```js
module.exports = [
  {
    title: '首页',
    page: 'pages/index/index',
    query: '',
    launchMode: 'default',
    scene: null,
    taro: ['weapp']
  }
]
```

### 小程序配置输出文件

```js
{
  weapp: 'project.private.config.json',
  qq: 'project.private.config.json',
  alipay: '.mini-ide/compileMode.json',
  tt: 'project.private.config.json',
  swan: 'project.swan.json',
  lark: 'project.config.json'
}
```

### 添加微信
添加请备注-项目名

![weixin](http://s6021rm6s.bkt.clouddn.com/weixin.webp)
