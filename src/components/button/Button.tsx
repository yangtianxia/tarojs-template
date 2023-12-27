// Vue
import {
  defineComponent,
  computed,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'

// Common
import { shallowMerge, pick } from '@txjs/shared'

// Component
import { Button, type ITouchEvent } from '@tarojs/components'
import { Icon } from '../icon'
import { Loading } from '../loading'

// Component utils
import { iconSharedProps } from '../icon/utils'
import { jumpLinkSharedProps, jumpLink } from '../mixins/jump-link'
import { createVNode } from '../_utils/basic'
import { preventDefault } from '../_utils/event'
import { addUnit } from '../_utils/style'
import { buttonNativeProps, buttonSharedProps, buttonNativePropKeys } from './utils'

const [name, bem] = BEM('button')

const buttonProps = shallowMerge({}, jumpLinkSharedProps, iconSharedProps, buttonSharedProps, buttonNativeProps)

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

export default defineComponent({
  name,

  props: buttonProps,

  setup(props, { slots, attrs }) {
    const rootStyle = computed(() => {
      const style = {} as CSSProperties
      const { color, plain, block, width } = props

      if (color) {
        if (plain) {
          style.color = color
          style.background = color
        } else {
          style.color = 'var(--color-white)'
        }
        style.borderColor = color.includes('gradient') ? 'transparent' : color
      }

      if (!block && width) {
        style.width = addUnit(width)
        style.display = 'flex'
      }

      return style
    })

    const onClick = (event: ITouchEvent) => {
      if (props.loading) {
        preventDefault(event)
      } else if (!props.disabled) {
        props.onTap?.(event)

        if (props.url) {
          jumpLink(
            props.url,
            props.linkQuery,
            props.linkType,
            props.linkBefore
          )
        }
      }
    }

    const renderText = () => {
      const childVNode = createVNode(
        props.loading
          ? props.loadingText
          : slots.default || props.text
      )

      if (childVNode) {
        if (props.type === 'cell') {
          return childVNode
        }

        return (
          <view class={bem('text')}>
            {childVNode}
          </view>
        )
      }
    }

    const renderIcon = () => {
      if (props.loading) {
        return (
          <Loading class={bem('loading')} />
        )
      }

      if (slots.icon) {
        return (
          <view class={bem('icon')}>
            {slots.icon?.()}
          </view>
        )
      }

      if (props.icon) {
        return (
          <view class={bem('icon', [props.icon])}>
            <Icon
              size={props.iconSize}
              name={props.icon}
            />
          </view>
        )
      }
    }

    return () => {
      const {
        type,
        size,
        bold,
        link,
        block,
        round,
        plain,
        square,
        loading,
        disabled,
        border,
        iconPosition
      } = props

      const cls = [
        bem([
          type,
          size,
          {
            block,
            round,
            square,
            loading,
            disabled,
            bold: link ? false : bold,
            plain: link || plain,
            link: link && type !== 'cell',
            hairline: plain && border,
            unclickable: disabled || loading
          }
        ])
      ]

      const state = pick(props, buttonNativePropKeys)

      if (props.loading || props.disabled) {
        delete buttonProps.formType
      }

      return (
        <Button
          {...attrs}
          {...state}
          class={cls}
          hoverClass={bem('active')}
          style={rootStyle.value}
          onTap={onClick}
        >
          {iconPosition === 'left' && renderIcon()}
          {renderText()}
          {iconPosition === 'right' && renderIcon()}
        </Button>
      )
    }
  }
})
