import { getSetting, authorize, openSetting, type AuthSetting } from '@tarojs/taro'
import { useModal } from '../modal'

type AuthSettingText = keyof AuthSetting

export const usePermissionCheck = async (perName: AuthSettingText) => {
  try {
    const { authSetting } = await getSetting()
    return authSetting[perName] || false
  } catch {
    return false
  }
}

export const usePermission = async (perName: AuthSettingText, perZhName: string) => {
  return new Promise<boolean>(async (resolve) => {
    if (await usePermissionCheck(perName)) {
      resolve(true)
    } else {
      try {
        await authorize({
          scope: perName
        })
        resolve(true)
      } catch {
        useModal({
          title: '权限申请',
          content: `需要使用${perZhName}权限，请前往设置打开权限`,
          onOk: async () => {
            await openSetting()
            // 打开权限设置页面依旧返回失败
            resolve(false)
          },
          onCancel: () => resolve(false)
        })
      }
    }
  })
}
