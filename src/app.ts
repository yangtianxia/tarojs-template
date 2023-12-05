import '@/style/ellipsis.less'
import '@/style/hairline.less'
import '@/style/normalize.less'
import '@/components/style/index.less'

import { createApp } from 'vue'

import App from '@/components/app'
import SafeArea from '@/components/safe-area'
import NavigationBar from '@/components/navigation-bar'
import Icon from '@/components/icon'
import Space from '@/components/space'
import Button from '@/components/button'
import Cell from '@/components/cell'

import router from '@/router'
import Store, { useAppStore, useUserStore } from '@/store'
import { canIUse, getUpdateManager, exitMiniProgram } from '@tarojs/taro'
import { useSystemInfo } from '@/hooks/system-info'
import { useThemeChange } from '@/hooks/theme-change'
import { EVENT_TYPE } from '@/shared/constants'

const app = createApp({
  onLaunch() {
    const appStore = useAppStore()
    const sysInfo = useSystemInfo()

    if (sysInfo.theme) {
      appStore.setInfo({
        theme: sysInfo.theme
      })
    }

    if (sysInfo.enableDebug) {
      mitt.on(EVENT_TYPE.REQUEST_EVENT, (event) => {
        console.log(event)
      })
    }

    useThemeChange(({ theme }) => {
      appStore.setInfo({ theme })
    })
  },
  onShow(options: Taro.getLaunchOptionsSync.LaunchOptions) {
    const appStore = useAppStore()
    const userStore = useUserStore()

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
        router.jumpLogin(path, query, 'redirectTo')
      }
    }

    appStore.setInfo(options)
    userStore.init()
  }
})

app.use(Store)
app.use(App)
app.use(SafeArea)
app.use(NavigationBar)
app.use(Icon)
app.use(Space)
app.use(Button)
app.use(Cell)

export default app
