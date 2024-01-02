import type { PropType } from 'vue'
import type { ButtonProps } from '@tarojs/components'
import type { ButtonSize, ButtonType, ButtonIconPosition } from './types'
import { truthProp, numericProp, VNodeProp, makeStringProp } from '../_utils/props'

export const buttonNativeProps = {
  lang: String as PropType<ButtonProps['lang']>,
  sessionFrom: String as PropType<ButtonProps['sessionFrom']>,
  sendMessageTitle: String as PropType<ButtonProps['sendMessageTitle']>,
  sendMessagePath: String as PropType<ButtonProps['sendMessagePath']>,
  sendMessageImg: String as PropType<ButtonProps['sendMessageImg']>,
  publicId: String as PropType<ButtonProps['publicId']>,
  appParameter: String as PropType<ButtonProps['appParameter']>,
  showMessageCard: Boolean as PropType<ButtonProps['showMessageCard']>,
  scope: String as PropType<ButtonProps['scope']>,
  formType: String as PropType<ButtonProps['formType']>,
  openType: String as PropType<ButtonProps['openType']>,
  onGetUserInfo: Function as PropType<ButtonProps['onGetUserInfo']>,
  onGetAuthorize: Function as PropType<ButtonProps['onGetAuthorize']>,
  onContact: Function as PropType<ButtonProps['onContact']>,
  onGetPhoneNumber: Function as PropType<ButtonProps['onGetPhoneNumber']>,
  onError: Function as PropType<ButtonProps['onError']>,
  onOpenSetting: Function as PropType<ButtonProps['onOpenSetting']>,
  onLaunchApp: Function as PropType<ButtonProps['onLaunchApp']>,
  onChooseAvatar: Function as PropType<ButtonProps['onChooseAvatar']>,
  onFollowLifestyle: Function as PropType<ButtonProps['onFollowLifestyle']>
}

export const buttonSharedProps = {
  color: String,
  link: Boolean,
  plain: Boolean,
  block: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  disabled: Boolean,
  border: truthProp,
  width: numericProp,
  danger: Boolean,
  text: VNodeProp,
  loadingText: VNodeProp,
  type: makeStringProp<ButtonType>('light'),
  size: makeStringProp<ButtonSize>('normal'),
  iconPosition: makeStringProp<ButtonIconPosition>('left'),
  onTap: Function as PropType<ButtonProps['onTap']>,
}

export type ButtonNativePropKeys = Array<keyof typeof buttonNativeProps>

export const buttonNativePropKeys = Object.keys(
  buttonNativeProps
) as ButtonNativePropKeys

export type ButtonPropKeys = Array<keyof typeof buttonSharedProps>

export const buttonPropKeys = Object.keys(
  buttonSharedProps
) as ButtonPropKeys
