const config = {
  pages: [
    'pages/home/index'
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

if (process.env.ENV === 'examples') {
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
      'toast/index'
    ]
  })
}

export default defineAppConfig(config)
