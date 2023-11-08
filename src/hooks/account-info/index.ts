import { canIUse, getAccountInfoSync } from '@tarojs/taro'
import { isNil } from '@txjs/bool'
import { useVersion } from '../version'

interface AccountInfoOption {
  appId: string
  version?: string
  envVersion?: 'develop' | 'trial' | 'release' | 'gray'
}

let miniProgram: AccountInfoOption

function canIUseGetAccountInfoSync() {
  if (process.env.TARO_ENV === 'alipay') {
    return useVersion('2.7.17')
  }
  return canIUse('getAccountInfoSync')
}

/**
 * 获取当前帐号信息
 */
export const useAccountInfo = () => {
  if (isNil(miniProgram)) {
    if (canIUseGetAccountInfoSync()) {
      miniProgram = getAccountInfoSync().miniProgram
    } else if (process.env.TARO_ENV === 'alipay') {
      miniProgram = {
        appId: my.getAppIdSync().appId
      }

      my.getRunScene({
        success: (res) => {
          miniProgram.envVersion = res.envVersion
        }
      })
    }
  }

  return miniProgram || {}
}
