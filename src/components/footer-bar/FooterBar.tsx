import { SafeArea } from '../safe-area'

import BEM from '@/shared/bem'
import debounce from 'debounce'
import { defineComponent, onMounted, onUnmounted, type ExtractPropTypes } from 'vue'
import { useRect } from '@/hooks'

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
    const id = useId()
    const { height, triggerBoundingClientRect } = useRect(`#${id}`, {
      refs: ['height']
    })
    const observer = new MutationObserver(
      debounce(() => triggerBoundingClientRect(), 32, true)
    )

    const bindingObserver = () => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el, {
          childList: true
        })
      }
    }

    onMounted(bindingObserver)

    onUnmounted(() => {
      if (observer) {
        observer.takeRecords()
        observer.disconnect()
      }
    })

    return () => (
      <>
        {props.placeholder ? (
          <view style={{ height: `${height.value}px` }} />
        ) : null}
        <view
          {...attrs}
          class={bem()}
          style={getZIndexStyle(props.zIndex)}
        >
          <view
            id={id}
            class={bem('content')}
          >
            {slots.default?.()}
          </view>
          <SafeArea show={props.safeAreaInsetBottom}>
            <view class={bem('bottom')} />
          </SafeArea>
        </view>
      </>
    )
  }
})
