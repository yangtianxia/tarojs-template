import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

import BEM from '@/shared/bem'
import debounce from 'debounce'
import { useSystemInfo, useRect, useNextTick } from '@/hooks'

import { addUnit, truthProp, makeStringProp } from '../utils'

type SafeAreaPosition = 'top' | 'bottom'

const [name] = BEM('safe-area')

const safeAreaProps = {
  show: truthProp,
  container: Function as PropType<() => HTMLElement | undefined>,
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
    let observer: MutationObserver

    const containerHeight = ref(0)

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

    const lazyContainerRect = debounce((id: string) => {
      useNextTick(async () => {
        const rect = await useRect(`#${id}`)
        if (rect) {
          containerHeight.value = rect.height
        }
      })
    }, 32, true)

    onMounted(() => {
      if (props.position === 'top' && props.container) {
        const container = props.container()

        if (container) {
          observer = new MutationObserver(() => lazyContainerRect(container.id))
          observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true
          })
        }
      }
    })

    onUnmounted(() => {
      if (observer) {
        observer.takeRecords()
        observer.disconnect()
      }
    })

    return () => {
      if (!props.show) return

      if (visible.value) {
        const style = {} as CSSProperties

        if (props.position === 'bottom') {
          style.paddingBottom = addUnit(screenHeight - safeArea!.bottom)
        } else if (props.position === 'top' && containerHeight.value >= (safeArea?.height! + statusBarHeight)) {
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
