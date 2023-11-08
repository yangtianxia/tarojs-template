import { RADIO_KEY } from './Group'
import Checker, { checkerSharedProps, CheckerShape, CheckerLabelPosition } from '../checkbox/Checker'

import BEM from '@/shared/bem'
import { defineComponent, type PropType, type ExtractPropTypes } from 'vue'
import { pick, shallowMerge } from '@txjs/shared'

import { useParent } from '../composables'

const [name, bem] = BEM('radio')

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

    const checked = () => {
      const value = parent ? parent.props.value : props.value
      return value === props.name
    }

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
        bem={bem}
        role="radio"
        parent={parent}
        checked={checked()}
        onToggle={toggle}
        {...props}
      />
    )
  }
})
