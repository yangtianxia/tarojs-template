// Vue
import {
  defineComponent,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

// Component utils
import { numericProp } from '../_utils/props'
import { addUnit } from '../_utils/style'

const [name, bem] = BEM('loading')

const loadingProps = {
  size: numericProp,
  vertical: Boolean,
  textSize: numericProp,
  color: String as PropType<CSSProperties['color']>,
  textColor: String as PropType<CSSProperties['color']>
}

export type LoadingProps = ExtractPropTypes<typeof loadingProps>

export default defineComponent({
  name,

  props: loadingProps,

  setup(props, { slots }) {
    const renderText = () => {
      if (slots.default) {
        return (
          <view
            class={bem('text')}
            style={{
              color: props.textColor ?? props.color,
              fontSize: addUnit(props.textSize)
            }}
          >
            {slots.default()}
          </view>
        )
      }
    }

    return () => (
      <view class={bem({ vertical: props.vertical })}>
        <view
          class={bem('spinner')}
          style={{
            color: props.color,
            fontSize: addUnit(props.size)
          }}
        />
        {renderText()}
      </view>
    )
  }
})
