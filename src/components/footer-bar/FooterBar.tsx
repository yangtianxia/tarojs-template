import { SafeArea } from '../safa-area'

import BEM from '@/shared/bem'
import debounce from 'debounce'
import { defineComponent, ref, onUnmounted, type ExtractPropTypes } from 'vue'
import { useReady } from '@tarojs/taro'
import { useNextTick, useRect } from '@/hooks'

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
    const height = ref(0)

    const lazyRect = debounce(() => {
      useNextTick(async () => {
        const rect = await useRect(`#${id}`)
        if (rect) {
          height.value = rect.height
        }
      })
    }, 32, true)

    const observer = new MutationObserver(lazyRect)

    useReady(() => {
      lazyRect()
      observer.observe(document.getElementById(id)!, {
        childList: true
      })
    })

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
