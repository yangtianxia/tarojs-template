import type { ViewProps } from '@tarojs/components'

import BEM from '@/shared/bem'
import { defineComponent, type PropType, type CSSProperties, type ExtractPropTypes } from 'vue'

import { addUnit, numericProp } from '../utils'
import type { IconName } from './types'

const [name, bem] = BEM('icon')

const classPrefix = 'van-icon'

const iconProps = {
  size: numericProp,
  color: String as PropType<CSSProperties['color']>,
  onTap: Function as PropType<ViewProps['onTap']>,
  onTouchStart: Function as PropType<ViewProps['onTouchStart']>,
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
    return () => (
      <view
        class={[
          bem(),
          classPrefix,
          `${classPrefix}-${props.name}`
        ]}
        style={{
          color: props.color,
          fontSize: addUnit(props.size)
        }}
        onTap={props.onTap}
        onTouchstart={props.onTouchStart}
      >
        {slots.default?.()}
      </view>
    )
  }
})
