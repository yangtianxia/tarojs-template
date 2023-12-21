import '@/assets/style/normalize.less'

import { createApp } from 'vue'
import { canIUse, getUpdateManager, exitMiniProgram } from '@tarojs/taro'
import router from '@/router'
import { useSystemInfo } from '@/hooks/system-info'
import { jumpLogin } from '@/shared/jump-login'
import { EVENT_TYPE } from '@/shared/constants'

const app = createApp({
  onLaunch () {
    const sysInfo = useSystemInfo()

    if (sysInfo.enableDebug) {
      emitter.on(EVENT_TYPE.REQUEST_EVENT, (event) => {
        console.log(event)
      })
    }
  },
  onShow (options: Taro.getLaunchOptionsSync.LaunchOptions) {
    if (canIUse('getUpdateManager')) {
      const updateManager = getUpdateManager()

      updateManager.onCheckForUpdate(({ hasUpdate }) => {
        if (!hasUpdate) return

        updateManager.onUpdateReady(() => {
          modal.info({
            title: '更新提示',
            content: '新版本已经准备好，现在更新并重启小程序~',
            confirmText: '立即更新',
            onOk: () => updateManager.applyUpdate()
          })
        })

        updateManager.onUpdateFailed(() => {
          modal.info({
            title: '更新失败',
            content: '小程序更新失败，请删除当前小程序，重新搜索打开哟~',
            onOk: () => exitMiniProgram()
          })
        })
      })
    }

    if (process.env.NODE_ENV === 'production') {
      const { path, query } = options
      const code = router.getPermission(path)

      if (code === 401) {
        jumpLogin(path, query, 'redirectTo')
      }
    }
  }
})

export default app
