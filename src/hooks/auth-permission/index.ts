import { getSetting, authorize, openSetting, type AuthSetting } from '@tarojs/taro'

type AuthSettingText = keyof AuthSetting

export const useAuthPermissionCheck = async (authName: AuthSettingText) => {
  try {
    const { authSetting } = await getSetting()
    return authSetting[authName] || false
  } catch {
    return false
  }
}

/**
 * 验证接口授权
 * @param authName 权限scope，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html#scope-%E5%88%97%E8%A1%A8)
 * @param authZhName 权限中文名
 */
export const useAuthPermission = async (authName: AuthSettingText, authZHName: string) => {
  return new Promise<boolean>(async (resolve) => {
    if (await useAuthPermissionCheck(authName)) {
      resolve(true)
    } else {
      try {
        await authorize({
          scope: authName
        })
        resolve(true)
      } catch {
        modal.confirm({
          title: t('hooks.auth.permission.title'),
          content: t('hooks.auth.permission.content', authZHName),
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
