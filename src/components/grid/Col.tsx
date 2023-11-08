import type { ViewProps } from '@tarojs/components'
import { ROW_KEY } from './Row'

import BEM from '@/shared/bem'
import { defineComponent, type PropType, type ExtractPropTypes } from 'vue'
import { isArray } from '@txjs/bool'

import { useParent } from '../composables/parent'
import { addUnit, numericProp } from '../utils'

const [name, bem] = BEM('col')

const colProps = {
  span: numericProp,
  offset: numericProp,
  onTap: Function as PropType<ViewProps['onTap']>
}

export type ColProps = ExtractPropTypes<typeof colProps>

export default defineComponent({
  name,

  props: colProps,

  setup(props, { slots }) {
    const { parent } = useParent(ROW_KEY)
    const gutter = (parent && parent.props.gutter) || 0
    let style = {}

    if (isArray(gutter)) {
      const paddingLR = addUnit(gutter[0])

      if (gutter.length > 1) {
        const paddingTB = addUnit(gutter[1])
        style = {
          paddingLeft: paddingLR,
          paddingRight: paddingLR,
          paddingTop: paddingTB,
          paddingBottom: paddingTB
        }
      } else {
        style = {
          paddingLeft: paddingLR,
          paddingRight: paddingLR
        }
      }
    } else if (gutter) {
      const padding = addUnit(gutter)
      style = { paddingLeft: padding, paddingRight: padding }
    }

    return () => {
      const { span, offset } = props

      return (
        <view
          style={style}
          class={bem({
            [span as any]: span,
            [`offset-${offset}`]: offset
          })}
          onTap={props.onTap}
        >
          {slots.default?.()}
        </view>
      )
    }
  }
})
