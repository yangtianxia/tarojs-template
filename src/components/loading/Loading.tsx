import type { ViewProps } from '@tarojs/components'

import BEM from '@/shared/bem'
import { defineComponent, type PropType, type CSSProperties, type ExtractPropTypes } from 'vue'

import { addUnit, numericProp, getSizeStyle } from '../utils'

const [name, bem] = BEM('loading')

const loadingProps = {
  size: numericProp,
  vertical: Boolean,
  textSize: numericProp,
  color: String as PropType<CSSProperties['color']>,
  textColor: String as PropType<CSSProperties['color']>,
  onTap: Function as PropType<ViewProps['onTap']>
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
              fontSize: addUnit(props.textSize),
              color: props.textColor ?? props.color
            }}
          >
            {slots.default()}
          </view>
        )
      }
    }

    return () => {
      const { vertical } = props
      return (
        <view
          class={bem({ vertical })}
          aria-live="polite"
          aria-busy={true}
        >
          <view
            class={bem('spinner')}
            style={{
              color: props.color,
              fontSize: addUnit(props.size),
              ...getSizeStyle(props.size)
            }}
          />
          {renderText()}
        </view>
      )
    }
  }
})
