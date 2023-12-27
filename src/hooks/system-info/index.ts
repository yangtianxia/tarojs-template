import { getSystemInfoSync } from '@tarojs/taro'
import { shallowMerge, toFixed } from '@txjs/shared'
import { isNil } from '@txjs/bool'

interface SystemInfo extends Taro.getSystemInfoSync.Result {
  isMobile: boolean
  isPC: boolean
  isIOS: boolean
  isAnd: boolean
  dpr: number
  hasBottomSafeArea: boolean
}

let systemInfo: SystemInfo

export const useSystemInfo = () => {
  if (isNil(systemInfo)) {
    const { system, ...info } = getSystemInfoSync()
    const isIOS = system.startsWith('iOS')
    const isAnd = system.startsWith('Android')

    systemInfo = shallowMerge(info, {
      system,
      isIOS,
      isAnd,
      isMobile: isIOS || isAnd,
      isPC: system.startsWith('Windows') || system.startsWith('macOS'),
      dpr: toFixed(750 / info.windowWidth, 2),
      hasBottomSafeArea: info.safeArea?.bottom !== info.screenHeight
    })

    if (process.env.TARO_ENV === 'alipay') {
      systemInfo.SDKVersion = my.SDKVersion
    }
  }
  return systemInfo || {}
}
