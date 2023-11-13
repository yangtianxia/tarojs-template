import BEM from '@/shared/bem'
import { defineComponent, computed, type CSSProperties, type ExtractPropTypes } from 'vue'
import { useSystemInfo } from '@/hooks'

import { addUnit, truthProp, makeStringProp } from '../utils'

type SafeAreaPosition = 'top' | 'bottom'

const [name] = BEM('safe-area')

const safeAreaProps = {
  show: truthProp,
  position: makeStringProp<SafeAreaPosition>('bottom')
}

const {
  hasSafeArea,
  safeArea,
  screenHeight,
  statusBarHeight = 0
} = useSystemInfo()

export type SafeAreaProps = ExtractPropTypes<typeof safeAreaProps>

export default defineComponent({
  name,

  props: safeAreaProps,

  setup(props, { slots }) {
    const visible = computed(() => {
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
          <view style={style} />
        )
      }

      return slots.default?.()
    }
  }
})
