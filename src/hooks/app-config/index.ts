import { getApp } from '@tarojs/taro'
import { isNil } from '@txjs/bool'

let AppConfig: Taro.Config

export const useAppConfig = () => {
  if (isNil(AppConfig)) {
    AppConfig = getApp()?.config
  }
  return AppConfig || {}
}
