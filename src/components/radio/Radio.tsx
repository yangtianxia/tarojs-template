import { defineComponent, computed, type PropType, type ExtractPropTypes } from 'vue'
import { pick, shallowMerge } from '@txjs/shared'

import type { CheckerShape, CheckerLabelPosition } from '../checker/types'

import Checker from '../checker'
import { checkerSharedProps } from '../checker/utils'
import { useParent } from '../composables/parent'
import { RADIO_KEY } from './Group'

const [name] = BEM('radio')

export const radioProps = shallowMerge({}, checkerSharedProps, {
  'onUpdate:value': Function as PropType<(value: unknown) => void>
})

export type RadioShape = CheckerShape
export type RadioLabelPosition = CheckerLabelPosition
export type RadioProps = ExtractPropTypes<typeof radioProps>

export default defineComponent({
  name,

  props: radioProps,

  setup(props, { emit, slots }) {
    const { parent } = useParent(RADIO_KEY)

    const checked = computed(() => {
      const value = parent ? parent.props.value : props.value
      return value === props.name
    })

    const toggle = () => {
      if (parent) {
        parent.updateValue(props.name)
      } else {
        emit('update:value', props.name)
      }
    }

    return () => (
      <Checker
        v-slots={pick(slots, ['default', 'icon'])}
        role="radio"
        parent={parent}
        checked={checked.value}
        onToggle={toggle}
        {...props}
      />
    )
  }
})
