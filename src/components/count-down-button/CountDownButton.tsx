import { Button, buttonSharedProps, buttonPropKeys, type ButtonSize } from '../button'

import BEM from '@/shared/bem'
import extend from 'extend'
import { defineComponent, reactive, onUnmounted, type PropType, type ExtractPropTypes } from 'vue'
import { pick, shallowMerge, callInterceptor, type Interceptor } from '@txjs/shared'

import { makeStringProp } from '../utils'

const [name, bem] = BEM('count-down-button')

const countDownButtonProps = shallowMerge({}, buttonSharedProps, {
  size: makeStringProp<ButtonSize>('mini'),
  beforeChange: Function as PropType<Interceptor>,
  timing: {
    type: Number as PropType<number>,
    default: 120
  },
  text: {
    type: String,
    default: '获取验证码'
  },
  beforeText: {
    type: String,
    default: '<s>秒后重发'
  },
  afterText: {
    type: String,
    default: '重新获取'
  }
})

export type CountDownButtonProps = ExtractPropTypes<typeof countDownButtonProps>

export default defineComponent({
  name,

  props: countDownButtonProps,

  setup(props, { slots }) {
    const state = reactive({
      timing: props.timing,
      disabled: false,
      loading: false,
      endTimer: false
    })

    let timer: ReturnType<typeof setInterval>

    const onClear = () => {
      clearInterval(timer)
      timer = null!
      state.disabled = false
      state.timing = props.timing
    }

    const onTimer = () => {
      if (state.timing > 0) {
        state.timing--
      } else {
        state.endTimer = true
        onClear()
      }
    }

    const onCountdown = () => {
      state.disabled = true
      state.endTimer = false
      timer = setInterval(onTimer, 1000)
    }

    const onTap = () => {
      state.loading = true
      callInterceptor(props.beforeChange, {
        done: () => {
          onCountdown()
          state.loading = false
        },
        canceled: () => {
          state.loading = false
        }
      })
    }

    const renderText = () => {
      if (state.disabled) {
        return props.beforeText.replace(/^<.*>(.*)?$/g, `${state.timing} $1`)
      }

      if (state.endTimer) {
        return props.afterText
      }

      return slots.default?.() || props.text
    }

    onUnmounted(onClear)

    return () => (
      <Button
        {...pick(extend({}, props, state), buttonPropKeys)}
        class={bem()}
        onTap={onTap}
      >
        {renderText()}
      </Button>
    )
  }
})
