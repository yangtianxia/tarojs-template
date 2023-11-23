import { defineComponent, type PropType, type ExtractPropTypes, type CSSProperties } from 'vue'
import { isArray } from '@txjs/bool'

import { useChildren } from '../composables/children'
import { addUnit, createInjectionKey } from '../utils'

const [name, bem] = BEM('row')

const rowProps = {
  type: String,
  align: String,
  justify: String,
  gutter: {
    type: [Number, Array] as PropType<number | number[]>,
    default: 0
  }
}

export type RowProps = ExtractPropTypes<typeof rowProps>

export type RowProvide = {
  props: RowProps
}

export const ROW_KEY = createInjectionKey<RowProvide>(name)

export default defineComponent({
  name,

  props: rowProps,

  setup(props, { slots }) {
    const { linkChildren } = useChildren(ROW_KEY)
    const flex = props.type === 'flex'
    const gutter = isArray(props.gutter) ? props.gutter[0] : props.gutter
    let style = {} as CSSProperties

    if (gutter) {
      const margin = `-${addUnit(gutter)}`
      style = {
        marginLeft: margin,
        marginRight: margin
      }
    }

    linkChildren({ props })

    return () => {
      const { align, justify } = props
      return (
        <view
          style={style}
          class={bem({
            flex,
            [`align-${align}`]: flex && align,
            [`justify-${justify}`]: flex && justify
          })}
        >
          {slots.default?.()}
        </view>
      )
    }
  }
})
