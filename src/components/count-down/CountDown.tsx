import { defineComponent, computed, watch, type PropType, type ExtractPropTypes } from 'vue'

import { useExpose } from '../composables/expose'
import { useCountDown, type CurrentTime } from '../composables/count-down'
import { truthProp, makeNumericProp, makeStringProp } from '../utils'
import { parseFormat } from './utils'

const [name, bem] = BEM('count-down')

export const countDownProps = {
  time: makeNumericProp(0),
  format: makeStringProp('HH:mm:ss'),
  autoStart: truthProp,
  millisecond: Boolean,
  onChange: Function as PropType<(current: CurrentTime) => void>,
  onFinish: Function as PropType<() => void>
}

export type CountDownProps = ExtractPropTypes<typeof countDownProps>

export default defineComponent({
  name,

  props: countDownProps,

  setup(props, { slots }) {
    const { start, pause, reset, current } = useCountDown({
      time: +props.time,
      millisecond: props.millisecond,
      onChange: (current) => props.onChange?.(current),
      onFinish: () => props.onFinish?.()
    })

    const timeText = computed(() =>
      parseFormat(props.millisecond ? 'HH:mm:ss:SSS' : props.format, current.value)
    )

    const resetTime = () => {
      reset(+props.time)

      if (props.autoStart) {
        start()
      }
    }

    watch(
      () => props.time,
      resetTime,
      { immediate: true }
    )

    useExpose({
      start,
      pause,
      reset: resetTime
    })

    return () => (
      <view
        role="timer"
        class={bem()}
      >
        {slots.default?.(current.value) || timeText.value}
      </view>
    )
  }
})
