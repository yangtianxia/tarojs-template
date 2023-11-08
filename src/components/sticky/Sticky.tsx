import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  type PropType,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'

import BEM from '@/shared/bem'
import { usePageScroll } from '@tarojs/taro'
import { isNil, isFunction } from '@txjs/bool'
import { shallowMerge } from '@txjs/shared'
import { useRect } from '@/hooks'

import { useId } from '../composables/id'
import { addUnit, numericProp, makeNumericProp, getZIndexStyle } from '../utils'

const [name, bem] = BEM('sticky')

export type StickyScrollOptions = {
  scrollTop: number
  height: number
  isFixed: boolean
}

export const stickyProps = {
  zIndex: numericProp,
  offsetTop: makeNumericProp(0),
  container: Function as PropType<() => Taro.NodesRef>,
  onScroll: Function as PropType<(options: StickyScrollOptions) => void>,
  onChange: Function as PropType<(isFixed: boolean) => void>
}

export type StickyProps = ExtractPropTypes<typeof stickyProps>

export default defineComponent({
  name,

  props: stickyProps,

  setup(props, { slots }) {
    const id = useId()
    const innerScrollTop = ref(0)

    const state = reactive({
      fixed: false,
      height: 0,
      transform: 0,
      offsetTop: 0
    })

    const offsetTop = computed(() => {
      let offset = parseFloat(`${props.offsetTop}`)

      if (isNaN(offset)) {
        offset = 0
      }

      return offset
    })

    const rootStyle = computed(() => {
      const style = {} as CSSProperties

      if (state.fixed) {
        shallowMerge(style, { height: addUnit(state.height) })
      }

      return style
    })

    const stickyStyle = computed(() => {
      const style = {} as CSSProperties

      if (state.fixed) {
        shallowMerge(style, getZIndexStyle(props.zIndex), {
          height: addUnit(state.height),
          top: addUnit(offsetTop.value)
        })

        if (state.transform) {
          style.transform = `translate3d(0, ${state.transform}px, 0)`
        }
      }

      return style
    })

    const getContainerRect = () => {
      const nodesRef = props.container!()
      return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>(
        (resolve) => nodesRef.boundingClientRect().exec((rect: any = []) => {
          return resolve(rect[0])
        })
      )
    }

    const setDataAfterDiff = (data: Record<string, any>) => {
      const diff = Object.keys(data)
        .reduce(
          (ret, key) => {
            if (data[key] !== state[key as keyof typeof state]) {
              ret[key] = data[key]
            }
            return ret
          }, {} as Record<string, any>
        )

      if (Object.keys(diff).length > 0) {
        shallowMerge(state, diff)
      }

      props.onScroll?.({
        scrollTop: innerScrollTop.value,
        height: state.height,
        isFixed: state.fixed
      })
    }

    const onScroll = (scrollTop: number) => {
      innerScrollTop.value = scrollTop || innerScrollTop.value

      if (isFunction(props.container)) {
        Promise.all([
          useRect(`#${id}`),
          getContainerRect()
        ])
          .then(([root, container]) => {
            if (root && container) {
              if (offsetTop.value + root.height > container.top + container.height) {
                setDataAfterDiff({
                  fixed: false,
                  transform: container.height - root.height
                })
              } else if (offsetTop.value > root.top) {
                setDataAfterDiff({
                  fixed: true,
                  height: root.height,
                  transform: 0
                })
              } else {
                setDataAfterDiff({
                  fixed: false,
                  transform: 0
                })
              }
            }
          })
        return
      }

      useRect(`#${id}`)
        .then((rect) => {
          if (isNil(rect)) return
          if (offsetTop.value > rect.top) {
            setDataAfterDiff({
              fixed: true,
              height: rect.height
            })
          } else {
            setDataAfterDiff({
              fixed: false
            })
          }
        })
    }

    watch(
      () => state.fixed,
      (value) => props.onChange?.(value)
    )

    usePageScroll(({ scrollTop }) => onScroll(scrollTop))

    return () => (
      <view
        id={id}
        style={rootStyle.value}
      >
        <view
          class={bem({ fixed: state.fixed })}
          style={stickyStyle.value}
        >
          {slots.default?.()}
        </view>
      </view>
    )
  }
})
