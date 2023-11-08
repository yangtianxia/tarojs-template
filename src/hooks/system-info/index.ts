import extend from 'extend'
import { getSystemInfoSync } from '@tarojs/taro'
import { isNil } from '@txjs/bool'

interface SystemInfo extends Taro.getSystemInfoSync.Result {
  hasSafeArea: boolean
  isMobile: boolean
  isPC: boolean
  isIOS: boolean
  isAnd: boolean
}

let systemInfo: SystemInfo

/**
 * 获取小程序系统环境
 */
export const useSystemInfo = () => {
  if (isNil(systemInfo)) {
    const { system, ...info } = getSystemInfoSync()
    const isIOS = system.startsWith('iOS')
    const isAnd = system.startsWith('Android')
    const isMobile = isIOS || isAnd
    const isPC = system.startsWith('Windows') || system.startsWith('macOS')
    const hasSafeArea = info.safeArea?.bottom !== info.screenHeight

    systemInfo = extend(info, {
      system,
      isIOS,
      isAnd,
      isPC,
      isMobile,
      hasSafeArea
    })

    if (process.env.TARO_ENV === 'alipay') {
      systemInfo.SDKVersion = my.SDKVersion
    }
  }
  return systemInfo || {}
}
