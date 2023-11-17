import type { CellInstance } from './Cell'

import BEM from '@/shared/bem'
import { defineComponent, watch, type ExtractPropTypes } from 'vue'
import { useReady } from '@tarojs/taro'

import { useChildren } from '../composables/children'
import { truthProp, numericProp, createInjectionKey } from '../utils'

const [name, bem] = BEM('cell-group')

const cellGroupProps = {
  title: String,
  inset: Boolean,
  border: truthProp,
  shrink: Boolean,
  titleWidth: numericProp
}

export type CellGroupProps = ExtractPropTypes<typeof cellGroupProps>

export type CellGroupProvide = {
  props: CellGroupProps
}

export const CELL_GROUP_KEY = createInjectionKey<CellGroupProvide>(name)

export default defineComponent({
  name,

  inheritAttrs: false,

  props: cellGroupProps,

  setup(props, { slots, attrs }) {
    const { children, linkChildren } = useChildren<CellInstance, CellGroupProvide>(CELL_GROUP_KEY)

    const updateCell = () => {
      const { length } = children
      if (length) {
        children.forEach((cell, index) => {
          cell.setBorder(
            length - 1 === index
              ? false
              : cell.border
          )
        })
      }
    }

    watch(
      () => children.length,
      updateCell
    )

    linkChildren({ props })

    useReady(updateCell)

    const renderGroup = () => {
      const { inset, shrink } = props

      return (
        <view
          {...attrs}
          class={[
            bem({ inset, shrink }),
            { 'hairline-surround': props.border && !inset }
          ]}
        >
          {slots.default?.()}
        </view>
      )
    }

    const renderTitle = () => (
      <view class={bem('title', { inset: props.inset })}>
        {slots.title?.() ?? props.title}
      </view>
    )

    return () => {
      if (slots.title || props.title) {
        return (
          <>
            {renderTitle()}
            {renderGroup()}
          </>
        )
      }

      return renderGroup()
    }
  }
})
