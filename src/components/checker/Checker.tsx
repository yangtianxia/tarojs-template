import { defineComponent, computed, type PropType, type CSSProperties } from 'vue'
import { shallowMerge } from '@txjs/shared'

import type { ITouchEvent } from '@tarojs/components'
import { addUnit, truthProp, preventDefault } from '../utils'
import { checkerSharedProps } from './utils'
import type { CheckerParent } from './types'

const [name, bem] = BEM('checker')

const checkerProps = shallowMerge({}, checkerSharedProps, {
  role: String,
  checked: Boolean,
  bindGroup: truthProp,
  parent: Object as PropType<CheckerParent | null>,
  onToggle: Function as PropType<() => void>
})

export default defineComponent({
  name,

  props: checkerProps,

  setup(props, { slots }) {
    const getParentProp = <T extends keyof CheckerParent['props']>(name: T) => {
      if (props.parent && props.bindGroup) {
        return props.parent.props[name]
      }
    }

    const internalDisabled = computed(() =>
      getParentProp('disabled') || props.disabled
    )
    const direction = computed(() => getParentProp('direction'))
    const iconStyle = computed(() => {
      const style = {} as CSSProperties
      const checkedColor = props.checkedColor || getParentProp('checkedColor')
      const iconSize = props.iconSize || getParentProp('iconSize')
      if (checkedColor && props.checked && !internalDisabled.value) {
        shallowMerge(style, {
          borderColor: checkedColor,
          backgroundColor: checkedColor
        })
      }
      if (iconSize) {
        style.fontSize = addUnit(iconSize)
      }
      return style
    })

    const onTap = (event: ITouchEvent) => {
      if (!internalDisabled.value) {
        props.onToggle?.()
      }
      props.onTap?.(event)
    }

    const renderIcon = () => {
      const disabled = internalDisabled.value
      const { shape, checked } = props
      return (
        <view
          class={bem('icon', [shape, { checked, disabled }])}
          style={iconStyle.value}
        >
          {slots.icon ? slots.icon({ checked, disabled }) : (
            <view class={bem('icon-check')} />
          )}
        </view>
      )
    }

    const renderLabel = () => {
      if (slots.default) {
        return (
          <view
            class={bem('label', [
              props.labelPosition,
              { disabled: internalDisabled.value }
            ])}
            onTap={(event: ITouchEvent) => {
              if (props.labelDisabled) {
                preventDefault(event, true)
              }
            }}
          >
            {slots.default()}
          </view>
        )
      }
    }

    return () => (
      <view
        onTap={onTap}
        role={props.role}
        class={bem([direction.value])}
      >
        {props.labelPosition === 'left' ? [renderLabel(), renderIcon()] : [renderIcon(), renderLabel()]}
      </view>
    )
  }
})
