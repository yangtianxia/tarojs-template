import { Button } from '../button'
import { Popup, popupSharedProps, popupSharedPropKeys } from '../popup'

import BEM from '@/shared/bem'
import { defineComponent, type ExtractPropTypes, type PropType } from 'vue'
import { pick, shallowMerge } from '@txjs/shared'
import { useNextTick } from '@/hooks'

import { truthProp, makeArrayProp } from '../utils'

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
  cancelText: String,
  description: String,
  closeOnPopstate: truthProp,
  closeOnClickAction: Boolean,
  safeAreaInsetBottom: truthProp,
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

  inheritAttrs: false,

  props: actionSheetProps,

  setup(props, { slots, emit }) {
    const updateShow = (show: boolean) => emit('update:show', show)

    const onCancel = () => {
      updateShow(false)
      props.onCancel?.()
    }

    const renderDescription = () => {
      if (slots.description || props.description) {
        return (
          <view class={bem('description')}>
            {slots.description?.() || props.description}
          </view>
        )
      }
    }

    const renderCancel = () => {
      if (slots.cancel || props.cancelText) {
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
              {slots.cancel?.() || props.cancelText}
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
            <view class={bem('option-label')}>{option.label}</view>
          ) : null}
        </>
      )
    }

    const renderOption = (option: ActionSheetOption, index: number) => {
      const { color, loading, disabled, className, callback } = option

      const onTap = () => {
        if (loading || disabled) return

        if (callback) {
          callback(option)
        }

        if (props.closeOnClickAction) {
          updateShow(false)
        }

        useNextTick(() => props.onSelect?.(option, index))
      }

      return (
        <Button
          block
          bold={false}
          disabled={disabled}
          loading={loading}
          size="large"
          iconPosition="right"
          class={[bem('option', { unclickable: loading || disabled }), className]}
          style={{ color }}
          onTap={onTap}
        >
          {renderOptionContent(option, index)}
        </Button>
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
