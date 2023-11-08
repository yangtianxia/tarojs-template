declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: any
      /** 环境 */
      NODE_ENV: 'development' | 'production'
      /** TARO环境 */
      TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'lark',
    }
  }
}

export {}
