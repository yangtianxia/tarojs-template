import { defineComponent, type ExtractPropTypes, type PropType } from 'vue'
import { pick, shallowMerge } from '@txjs/shared'
import { useNextTick } from '@/hooks'

import { Button } from '../button'
import { Popup, popupSharedProps, popupSharedPropKeys } from '../popup'
import { truthProp, vnodeProp, genVNode, makeArrayProp } from '../utils'

const [name, bem] = BEM('action-sheet')

export type ActionSheetOption = {
  title?: string
  color?: string
  label?: string
  loading?: boolean
  disabled?: boolean
  className?: unknown
  callback?: (option: ActionSheetOption) => void
}

export const actionSheetProps = shallowMerge({}, popupSharedProps, {
  round: truthProp,
  actions: makeArrayProp<ActionSheetOption>(),
  description: vnodeProp,
  closeOnPopstate: truthProp,
  closeOnClickAction: Boolean,
  safeAreaInsetBottom: truthProp,
  cancelText: {
    type: vnodeProp,
    default: '取消'
  },
  onSelect: Function as PropType<(option: ActionSheetOption, index: number) => void>,
  onCancel: Function as PropType<() => void>,
  'onUpdate:show': Function as PropType<(value: boolean) => void>
})

export type ActionSheetProps = ExtractPropTypes<typeof actionSheetProps>

const popupPropsKeys = [
  ...popupSharedPropKeys,
  'round',
  'closeOnPopstate',
  'safeAreaInsetBottom'
] as const

export default defineComponent({
  name,

  props: actionSheetProps,

  setup(props, { slots, emit }) {
    const updateShow = (show: boolean) => emit('update:show', show)

    const onOptionTap = (option: ActionSheetOption, index: number) => {
      const { loading, disabled, callback } = option

      if (loading || disabled) return

      if (callback) {
        callback(option)
      }

      if (props.closeOnClickAction) {
        updateShow(false)
      }

      useNextTick(() => props.onSelect?.(option, index))
    }

    const onCancel = () => {
      updateShow(false)
      props.onCancel?.()
    }

    const renderDescription = () => {
      const description = genVNode(slots.description || props.description)
      if (description) {
        return (
          <view class={bem('description')}>
            {description}
          </view>
        )
      }
    }

    const renderCancel = () => {
      const cencel = genVNode(slots.cancel || props.cancelText)
      if (cencel) {
        return (
          <>
            <view class={bem('gap')} />
            <Button
              block
              bold={false}
              size="large"
              class={bem('cancel')}
              onTap={onCancel}
            >
              {cencel}
            </Button>
          </>
        )
      }
    }

    const renderOptionContent = (option: ActionSheetOption, index: number) => {
      if (slots.option) {
        return slots.option({ option, index })
      }

      return (
        <>
          <text>{option.title}</text>
          {option.label ? (
            <view class={bem('option-label')}>
              {option.label}
            </view>
          ) : null}
        </>
      )
    }

    const renderOption = (option: ActionSheetOption, index: number) => {
      const { color, loading, disabled, className } = option
      return (
        <view class={bem('option-container')}>
          <Button
            block
            bold={false}
            disabled={disabled}
            loading={loading}
            size="large"
            iconPosition="right"
            class={[bem('option', { unclickable: loading || disabled }), className]}
            style={{ color }}
            onTap={() => onOptionTap(option, index)}
          >
            {renderOptionContent(option, index)}
          </Button>
        </view>
      )
    }

    return () => (
      <Popup
        class={bem()}
        position="bottom"
        onUpdate:show={props['onUpdate:show'] || updateShow}
        {...pick(props, popupPropsKeys)}
      >
        {renderDescription()}
        <view class={bem('content')}>
          {props.actions.map(renderOption)}
        </view>
        {renderCancel()}
      </Popup>
    )
  }
})
