import { defineComponent, reactive, type PropType, type ExtractPropTypes } from 'vue'
import { pick, shallowMerge, callInterceptor, type Interceptor } from '@txjs/shared'

import { Button, buttonSharedProps, buttonPropKeys, type ButtonSize } from '../button'
import { useCountDown } from '../composables/count-down'
import { vnodeProp, makeNumberProp, makeStringProp, genVNode } from '../utils'

const [name, bem] = BEM('count-down-button')

const countDownButtonProps = shallowMerge({}, buttonSharedProps, {
  timing: makeNumberProp(30),
  size: makeStringProp<ButtonSize>('mini'),
  beforeText: makeStringProp('[S] 秒后重发'),
  text: {
    type: vnodeProp,
    default: '获取验证码'
  },
  afterText: {
    type: vnodeProp,
    default: '重新获取'
  },
  beforeChange: Function as PropType<Interceptor>
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
      finish: false
    })

    const { start, reset } = useCountDown({
      time: state.timing * 1000,
      onChange: ({ total }) => {
        state.timing = Math.floor(total / 1000)
      },
      onFinish: () => {
        state.disabled = false
        state.finish = true
        state.timing = props.timing
        reset()
      }
    })

    const formatText = (value: string) => {
      return value.replace(/^\[S\](.*)?$/g, `${state.timing}$1`)
    }

    const onTap = () => {
      state.loading = true
      callInterceptor(props.beforeChange, {
        done: () => {
          state.disabled = true
          state.finish = false
          state.loading = false
          start()
        },
        canceled: () => {
          state.loading = false
        }
      })
    }

    const renderText = () => {
      const text = state.disabled
        ? formatText(props.beforeText)
        : state.finish
          ? props.afterText
          : slots.default || props.text
      return genVNode(text)
    }

    return () => (
      <Button
        {...pick(shallowMerge({}, props, state), buttonPropKeys)}
        class={bem()}
        onTap={onTap}
      >
        {renderText()}
      </Button>
    )
  }
})
