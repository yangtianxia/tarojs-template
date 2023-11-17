import type { ITouchEvent } from '@tarojs/components'
import { Icon, type IconName } from '../icon'

import BEM from '@/shared/bem'
import { defineComponent, ref, computed, Transition, type PropType, type ExtractPropTypes } from 'vue'

type AlertType = 'normal' | 'success' | 'info' | 'warning' | 'error'

const [name, bem] = BEM('alert')

const alertProps = {
  showIcon: Boolean,
  message: String,
  description: String,
  closeText: String,
  closable: Boolean,
  banner: Boolean,
  icon: String as PropType<IconName>,
  type: String as PropType<AlertType>,
  onClose: Function as PropType<(event: ITouchEvent) => void>
}

export type AlertProps = ExtractPropTypes<typeof alertProps>

export default defineComponent({
  name,

  props: alertProps,

  setup(props, { slots }) {
    const closing = ref(false)
    const closed = ref(false)

    const type = computed(() => {
      if (props.type) {
        return props.type
      }

      if (props.banner) {
        return 'warning'
      }

      return 'info'
    })

    const showIcon = computed(() =>
      props.showIcon || props.banner
    )

    const withDescription = computed(() =>
      !!slots.description || props.description
    )

    const iconName = computed(() => {
      if (props.icon) {
        return props.icon
      }

      if (withDescription.value) {
        switch (type.value) {
          case 'info':
            return 'info-o'
          case 'success':
            return 'passed'
          case 'warning':
            return 'warning-o'
          case 'error':
            return 'close'
        }
      }

      switch (type.value) {
        case 'info':
          return 'info'
        case 'success':
          return 'checked'
        case 'error':
          return 'clear'
        case 'warning':
        default:
          return 'warning'
      }
    })

    const onClose = (event: ITouchEvent) => {
      closing.value = true
      props.onClose?.(event)
    }

    const renderIcon = () => {
      if (showIcon.value) {
        if (slots.icon) {
          return slots.icon()
        }

        if (iconName.value) {
          return (
            <view class={bem('icon')}>
              <Icon name={iconName.value} />
            </view>
          )
        }
      }
    }

    const renderMessage = () => {
      if (slots.message || props.message) {
        return (
          <view class={bem('message')}>
            {slots.message?.() || props.message}
          </view>
        )
      }
    }

    const renderDescription = () => {
      if (withDescription.value) {
        return (
          <view class={bem('description')}>
            {slots.description?.() || props.description}
          </view>
        )
      }
    }

    const renderAction = () => {
      if (slots.action) {
        return (
          <view class={bem('action')}>
            {slots.action()}
          </view>
        )
      }
    }

    const renderCloseIcon = () => {
      if (props.closable) {
        return (
          <view
            class={bem('close-icon')}
            onTap={onClose}
          >
            {slots.closeIcon?.() || props.closeText ? (
              <text>{props.closeText}</text>
            ) : (
              <Icon name="cross" />
            )}
          </view>
        )
      }
    }

    return () => {
      if (closed.value) return

      return (
        <Transition
          name="alert-fade"
          onAfterLeave={() => closed.value = true}
        >
          <view
            v-show={!closing.value}
            class={bem([type.value, {
              banner: props.banner,
              'with-description': withDescription.value
            }])}
          >
            {renderIcon()}
            <view class={bem('content')}>
              {renderMessage()}
              {renderDescription()}
            </view>
            {renderAction()}
            {renderCloseIcon()}
          </view>
        </Transition>
      )
    }
  }
})
