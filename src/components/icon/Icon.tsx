// Vue
import {
  defineComponent,
  computed,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

// Component utils
import { numericProp } from '../_utils/props'
import { addUnit } from '../_utils/style'

const [name, bem] = BEM('icon')

const iconProps = {
  size: numericProp,
  color: String as PropType<CSSProperties['color']>,
  iconPrefix: {
    type: String,
    default: 'van'
  },
  name: {
    type: String as PropType<IconTypes>,
    required: true
  }
}

export type IconProps = ExtractPropTypes<typeof iconProps>

export default defineComponent({
  name,

  props: iconProps,

  setup(props, { slots }) {
    const cls = computed(() =>
      `${props.iconPrefix}-icon`
    )

    return () => (
      <view
        class={[
          bem(),
          cls.value,
          `${cls.value}-${props.name}`
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
