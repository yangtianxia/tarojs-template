import {
  defineComponent,
  computed,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'
import { pick, shallowMerge } from '@txjs/shared'

import { Button, type ButtonProps as TaroButtonProps, type ITouchEvent } from '@tarojs/components'
import { Loading } from '../loading'
import { Icon } from '../icon'
import { genVNode, preventDefault, addUnit, type GenVNodeReturn } from '../utils'
import { jumpLink, jumpLinkSharedProps } from '../mixins'
import { buttonSharedProps } from './utils'

const [name, bem] = BEM('button')

const buttonPrivateProps = {
  lang: String as PropType<TaroButtonProps['lang']>,
  sessionFrom: String as PropType<TaroButtonProps['sessionFrom']>,
  sendMessageTitle: String as PropType<TaroButtonProps['sendMessageTitle']>,
  sendMessagePath: String as PropType<TaroButtonProps['sendMessagePath']>,
  sendMessageImg: String as PropType<TaroButtonProps['sendMessageImg']>,
  publicId: String as PropType<TaroButtonProps['publicId']>,
  appParameter: String as PropType<TaroButtonProps['appParameter']>,
  showMessageCard: Boolean as PropType<TaroButtonProps['showMessageCard']>,
  scope: String as PropType<TaroButtonProps['scope']>,
  formType: String as PropType<TaroButtonProps['formType']>,
  openType: String as PropType<TaroButtonProps['openType']>,
  onGetUserInfo: Function as PropType<TaroButtonProps['onGetUserInfo']>,
  onGetAuthorize: Function as PropType<TaroButtonProps['onGetAuthorize']>,
  onContact: Function as PropType<TaroButtonProps['onContact']>,
  onGetPhoneNumber: Function as PropType<TaroButtonProps['onGetPhoneNumber']>,
  onError: Function as PropType<TaroButtonProps['onError']>,
  onOpenSetting: Function as PropType<TaroButtonProps['onOpenSetting']>,
  onLaunchApp: Function as PropType<TaroButtonProps['onLaunchApp']>,
  onChooseAvatar: Function as PropType<TaroButtonProps['onChooseAvatar']>,
  onFollowLifestyle: Function as PropType<TaroButtonProps['onFollowLifestyle']>
}

const buttonProps = shallowMerge({}, jumpLinkSharedProps, buttonSharedProps, buttonPrivateProps)

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

export default defineComponent({
  name,

  props: buttonProps,

  setup(props, { attrs, slots }) {
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

        style.borderColor = color.includes('gradient')
          ? 'transparent'
          : color
      }

      if (!block && width) {
        style.width = addUnit(width)
        style.display = 'flex'
      }

      return style
    })

    const onTap = (event: ITouchEvent) => {
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
      let childVNode: GenVNodeReturn | undefined

      if (props.loading) {
        childVNode = genVNode(props.loadingText)
      } else {
        childVNode = genVNode(slots.default || props.text)
      }

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

      const classes = [
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

      const buttonProps = {
        ...attrs,
        ...pick(props, [
          'lang',
          'scope',
          'sessionFrom',
          'sendMessageImg',
          'sendMessagePath',
          'sendMessageTitle',
          'publicId',
          'appParameter',
          'showMessageCard',
          'openType',
          'formType',
          'onGetUserInfo',
          'onChooseAvatar',
          'onContact',
          'onError',
          'onFollowLifestyle',
          'onGetAuthorize',
          'onGetPhoneNumber',
          'onLaunchApp',
          'onOpenSetting'
        ]),
        onTap: onTap
      }

      if (props.loading || props.disabled) {
        delete buttonProps.formType
      }

      return (
        <Button
          {...buttonProps}
          class={classes}
          hoverClass={bem('active')}
          style={rootStyle.value}
        >
          {iconPosition === 'left' && renderIcon()}
          {renderText()}
          {iconPosition === 'right' && renderIcon()}
        </Button>
      )
    }
  }
})
