import { getApp } from '@tarojs/taro'
import { isNil } from '@txjs/bool'

let AppConfig: Taro.Config

/**
 * 获取到小程序全局配置
 */
export const useAppConfig = () => {
  if (isNil(AppConfig)) {
    AppConfig = getApp()?.config
  }
  return AppConfig || {}
}
