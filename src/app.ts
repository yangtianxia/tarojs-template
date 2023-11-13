import '@/style/ellipsis.less'
import '@/style/hairline.less'
import '@/style/normalize.less'
import '@/components/style/index.less'

import App from '@/components/app'
import NavigationBar from '@/components/navigation-bar'
import Icon from '@/components/icon'
import Button from '@/components/button'
import Cell from '@/components/cell'

import router from '@/router'
import store, { useThemeStore, useUserStore } from '@/store'
import mitt from '@/shared/mitt'
import { createApp } from 'vue'
import { canIUse, getUpdateManager, exitMiniProgram } from '@tarojs/taro'
import { useSystemInfo } from '@/hooks/system-info'
import { useModal } from '@/hooks/modal'
import { useThemeChange } from '@/hooks/theme-change'
import { EVENT_TYPE } from '@/shared/constants'

const app = createApp({
  onLaunch() {
    const themeStore = useThemeStore()
    const sysInfo = useSystemInfo()

    if (sysInfo.theme) {
      themeStore.setTheme(sysInfo.theme)
    }

    if (sysInfo.enableDebug) {
      mitt.on(EVENT_TYPE.REQUEST_EVENT, (event) => {
        console.log(event)
      })
    }

    useThemeChange(({ theme }) => {
      themeStore.setTheme(theme)
    })
  },
  onShow(options: Taro.getLaunchOptionsSync.LaunchOptions) {
    const userStore = useUserStore()

    if (canIUse('getUpdateManager')) {
      const updateManager = getUpdateManager()

      updateManager.onCheckForUpdate(({ hasUpdate }) => {
        if (!hasUpdate) return

        updateManager.onUpdateReady(() => {
          useModal.info({
            title: '更新提示',
            content: '新版本已经准备好，现在更新并重启小程序~',
            confirmText: '立即更新',
            onOk: () => updateManager.applyUpdate()
          })
        })

        updateManager.onUpdateFailed(() => {
          useModal.info({
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
        router.jumpLogin(path, query, 'redirectTo')
      }
    }

    userStore.init()
  }
})

app.use(store)
app.use(App)
app.use(NavigationBar)
app.use(Icon)
app.use(Button)
app.use(Cell)

export default app
