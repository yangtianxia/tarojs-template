// Types
import type { SafeAreaPosition } from './types'

// Vue
import {
  defineComponent,
  computed,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

// Common
import { useAppStore } from '@/store'
import { useSystemInfo } from '@/hooks/system-info'

// Component utils
import { truthProp, makeStringProp } from '../_utils/props'
import { addUnit } from '../_utils/style'

const {
  safeArea,
  screenHeight,
  hasBottomSafeArea,
  statusBarHeight = 0
} = useSystemInfo()

const [name, bem] = BEM('safe-area')

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
      if (appStore.isEmbedded) {
        return false
      }

      switch (props.position) {
        case 'bottom':
          return hasBottomSafeArea
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
            {...attrs}
            catchMove
            disableScroll
            class={bem()}
            style={style}
          />
        )
      }

      return slots.default?.()
    }
  }
})
