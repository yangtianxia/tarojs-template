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
    navigationBarBackgroundColor: '@white',
    navigationBarTitleText: process.env.PROJECT_NAME
  },
  useExtendedLib: {
    weui: true
  },
  style: 'v2'
} as Taro.Config

// 兼容alipay顶部栏配置
if (process.env.TARO_ENV === 'alipay') {
  config.window = {
    ...config.window,
    transparentTitle: 'always',
    titlePenetrate: 'YES',
    titleBarColor: '#ffffff'
  }
}

export default defineAppConfig(config)
