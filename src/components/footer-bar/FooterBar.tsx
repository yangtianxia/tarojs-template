import { defineComponent, type ExtractPropTypes } from 'vue'
import { useRect } from '@/hooks'

import { SafeArea } from '../safe-area'
import { useId } from '../composables/id'
import { truthProp, makeNumericProp, getZIndexStyle } from '../utils'

const [name, bem] = BEM('footer-bar')

const footerBarProps = {
  zIndex: makeNumericProp(610),
  placeholder: truthProp,
  safeAreaInsetBottom: truthProp
}

export type FooterBarProps = ExtractPropTypes<typeof footerBarProps>

export default defineComponent({
  name,

  inheritAttrs: false,

  props: footerBarProps,

  setup(props, { slots, attrs }) {
    const contentId = useId()
    const { height } = useRect(`#${contentId}`, {
      refs: ['height'],
      observe: true
    })

    return () => (
      <view>
        {props.placeholder ? (
          <view style={{ height: `${height.value}px` }} />
        ) : null}
        <view
          {...attrs}
          class={bem()}
          style={getZIndexStyle(props.zIndex)}
        >
          <view
            id={contentId}
            class={bem('content')}
          >
            {slots.default?.()}
          </view>
          <SafeArea show={props.safeAreaInsetBottom}>
            <view class={bem('bottom')} />
          </SafeArea>
        </view>
      </view>
    )
  }
})
