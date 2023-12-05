import { defineComponent, onMounted } from 'vue'
import { getCurrentInstance } from '@tarojs/taro'
import { useTabbarStore } from '@/store'
import { useAppConfig, useRect, useNextTick, useRouter } from '@/hooks'

import less from './index.module.less'

const [name, bem] = BEM('tab-bar', less)

const GLOBAL_CLASS = 'CUSTOM_TAB_BAR'

export default defineComponent({
  name,

  options: {
    addGlobalClass: true
  },

  setup() {
    const router = useRouter()
    const appConfig = useAppConfig()
    const context = getCurrentInstance()
    const tabbarStore = useTabbarStore()
    const { boundingClientRect } = useRect(() => `.${GLOBAL_CLASS}`, {
      target: context.page?.getTabBar?.()
    })

    const tabbarList = appConfig?.tabBar?.list || []

    const onSwitchTab = (path: string, index: number) => {
      if (tabbarStore.currentIndex === index) return
      router.switchTab(path)
    }

    const patchIconPath = (src: string) => {
      if (process.env.TARO_ENV === 'alipay') {
        return '../.'.concat(src)
      }
      return '.'.concat(src)
    }

    tabbarStore.setTabbar(tabbarList)
    tabbarStore.setCurrentPath(
      context.router?.path!
    )

    onMounted(() => {
      useNextTick(() => {
        boundingClientRect((rect) => {
          tabbarStore.setHeight(rect.height)
        })
      })
    })

    return () => {
      if (!tabbarList.length) return

      return (
        <cover-view class={[bem(), GLOBAL_CLASS]}>
          <cover-view class={bem('list')}>
            {tabbarList.map((item, index) => {
              const active = index === tabbarStore.currentIndex
              const iconPath = active ? item.selectedIconPath : item.iconPath
              return (
                <cover-view
                  key={item.pagePath}
                  class={bem('item', { active })}
                  onTap={() => onSwitchTab(item.pagePath, index)}
                >
                  <cover-image
                    class={bem('icon')}
                    src={patchIconPath(iconPath!)}
                  />
                  <cover-view class={bem('text')}>{item.text}</cover-view>
                </cover-view>
              )
            })}
          </cover-view>
          <gm-safe-area>
            <view class={bem('bottom')} />
          </gm-safe-area>
        </cover-view>
      )
    }
  }
})
