import type { ViewProps, ITouchEvent } from '@tarojs/components'

import BEM from '@/shared/bem'
import extend from 'extend'
import { defineComponent, Transition, type PropType, type CSSProperties, type ExtractPropTypes } from 'vue'
import { notNil } from '@txjs/bool'

import { useLazyRender } from '../composables/lazy-render'
import { truthProp, numericProp, unknownProp, getZIndexStyle, preventDefault } from '../utils'

const [name, bem] = BEM('overlay')

export const overlaySharedProps = {
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object as PropType<CSSProperties>,
  onTap: Function as PropType<ViewProps['onTap']>,
  onTouchStart: Function as PropType<ViewProps['onTouchStart']>,
  onTouchMove: Function as PropType<ViewProps['onTouchMove']>,
  onTouchEnd: Function as PropType<ViewProps['onTouchEnd']>
}

const overlayProps = overlaySharedProps

export type OverlayProps = ExtractPropTypes<typeof overlayProps>

export default defineComponent({
  name,

  inheritAttrs: false,

  props: overlayProps,

  setup(props, { slots, attrs }) {
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender)

    const onMove = (event: ITouchEvent) => {
      preventDefault(event, true)
      props.onTouchMove?.(event)
    }

    const renderOverlay = lazyRender(() => {
      const style: CSSProperties = extend(
        getZIndexStyle(props.zIndex),
        props.customStyle
      )

      if (notNil(props.duration)) {
        style.animationDuration = `${props.duration}s`
      }

      return (
        <view
          {...attrs}
          v-show={props.show}
          style={style}
          class={[bem(), props.className]}
          catchMove={props.lockScroll}
          // @ts-ignore only alipay
          disableScroll={props.lockScroll}
          onTap={props.onTap}
          onTouchmove={onMove}
          onTouchstart={props.onTouchStart}
          onTouchend={props.onTouchEnd}
        >
          {slots.default?.()}
        </view>
      )
    })

    return () => (
      <Transition
        v-slots={{ default: renderOverlay }}
        name="overlay-fade"
        appear
      />
    )
  }
})
