import { defineComponent, computed, type CSSProperties, type ExtractPropTypes } from 'vue'
import { useAppStore } from '@/store'
import { useSystemInfo } from '@/hooks'

import { addUnit, truthProp, makeStringProp } from '../utils'

type SafeAreaPosition = 'top' | 'bottom'

const {
  hasSafeArea,
  safeArea,
  screenHeight,
  statusBarHeight = 0
} = useSystemInfo()

const [name] = BEM('safe-area')

const safeAreaProps = {
  show: truthProp,
  position: makeStringProp<SafeAreaPosition>('bottom')
}

export type SafeAreaProps = ExtractPropTypes<typeof safeAreaProps>

export default defineComponent({
  name,

  inheritAttrs: false,

  props: safeAreaProps,

  setup(props, { slots, attrs }) {
    const appStore = useAppStore()

    const visible = computed(() => {
      // 半屏打开不可见
      if (appStore.apiCategory === 'embedded') {
        return false
      }

      switch (props.position) {
        case 'bottom':
          return hasSafeArea
        case 'top':
          return statusBarHeight != 0
        default:
          return false
      }
    })

    return () => {
      if (!props.show) return

      if (visible.value) {
        const style = {} as CSSProperties

        if (props.position === 'bottom') {
          style.paddingBottom = addUnit(screenHeight - safeArea!.bottom)
        } else if (props.position === 'top') {
          style.paddingTop = addUnit(statusBarHeight)
        }

        return (
          <view
            catchMove
            disableScroll
            {...attrs}
            style={style}
          />
        )
      }

      return slots.default?.()
    }
  }
})
