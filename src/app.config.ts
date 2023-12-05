const config = {
  pages: [
    'pages/home/index',
    'pages/my/index'
  ],
  subpackages: [{
    root: 'subpackages',
    pages: [
      'error/index',
      'login/index'
    ]
  }],
  window: {
    navigationStyle: 'custom',
    backgroundColor: '@grey200',
    backgroundColorTop: '@grey200',
    backgroundColorBottom: '@grey200',
    navigationBarTextStyle: '@navigation' as unknown,
    navigationBarBackgroundColor: '@section',
    navigationBarTitleText: process.env.PROJECT_NAME
  },
  tabBar: {
    custom: true,
    color: '@grey800',
    selectedColor: '@primary500',
    backgroundColor: '@section',
    borderStyle: 'white',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index',
        iconPath: './assets/home.png',
        selectedIconPath: './assets/home-active.png'
      },
      {
        text: '我的',
        pagePath: 'pages/my/index',
        iconPath: './assets/my.png',
        selectedIconPath: './assets/my-active.png'
      }
    ]
  },
  useExtendedLib: {
    weui: true
  },
  style: 'v2'
} as Taro.Config

// 支付宝特性配置
if (process.env.TARO_ENV === 'alipay') {
  config.window = {
    ...config.window,
    titleBarColor: '#ffffff'
  }
}

if (process.env.ENV === 'development') {
  config.subpackages!.push({
    root: 'examples',
    pages: [
      'button/index',
      'cascader/index',
      'grid/index',
      'cell/index',
      'checkbox/index',
      'radio/index',
      'result/index',
      'form/index',
      'alert/index',
      'list/index',
      'footer-bar/index',
      'action-sheet/index',
      'count-down/index',
      'range-date-picker/index',
      'popup/index',
      'tabs/index',
      'toast/index'
    ]
  })
}

export default defineAppConfig(config)
