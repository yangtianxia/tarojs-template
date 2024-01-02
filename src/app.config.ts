const config = {
  pages: [
    'pages/index/index'
  ],
  subpackages: [
    {
      root: 'subpackage',
      pages: [
        'error/index'
      ]
    }
  ],
  window: {
    navigationStyle: 'custom',
    backgroundColor: '@grey-2',
    backgroundColorTop: '@grey-2',
    backgroundColorBottom: '@grey-2',
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
    titleBarColor: '@section'
  }
}

export default defineAppConfig(config)
