import {
  defineComponent,
  computed,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

import { addUnit, numericProp } from '../utils'
import type { IconName } from './types'

const [name, bem] = BEM('icon')

const iconProps = {
  size: numericProp,
  color: String as PropType<CSSProperties['color']>,
  iconPrefix: {
    type: String,
    default: 'van'
  },
  name: {
    type: String as PropType<IconName>,
    required: true
  }
}

export type IconProps = ExtractPropTypes<typeof iconProps>

export default defineComponent({
  name,

  props: iconProps,

  setup(props, { slots }) {
    const classes = computed(() =>
      `${props.iconPrefix}-icon`
    )

    return () => (
      <view
        class={[
          bem(),
          classes.value,
          `${classes.value}-${props.name}`
        ]}
        style={{
          color: props.color,
          fontSize: addUnit(props.size)
        }}
      >
        {slots.default?.()}
      </view>
    )
  }
})
