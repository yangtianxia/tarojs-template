const config = {
  pages: [
    'pages/home/index'
  ],
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

export default defineAppConfig(config)
