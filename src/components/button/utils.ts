import type { PropType } from 'vue'
import type { ButtonProps } from '@tarojs/components'
import type { IconName } from '../icon'
import type { ButtonSize, ButtonType, ButtonIconPosition } from './types'
import { truthProp, numericProp, makeNumericProp, makeStringProp } from '../utils'

export const buttonSharedProps = {
  text: String,
  color: String,
  link: Boolean,
  plain: Boolean,
  block: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  disabled: Boolean,
  loadingText: String,
  border: truthProp,
  bold: truthProp,
  width: numericProp,
  icon: String as PropType<IconName>,
  iconSize: makeNumericProp(14),
  type: makeStringProp<ButtonType>('default'),
  size: makeStringProp<ButtonSize>('normal'),
  iconPosition: makeStringProp<ButtonIconPosition>('left'),
  hoverClass: String as PropType<ButtonProps['hoverClass']>,
  hoverStartTime: Number as PropType<ButtonProps['hoverStartTime']>,
  hoverStayTime: Number as PropType<ButtonProps['hoverStayTime']>,
  hoverStopPropagation: Boolean as PropType<ButtonProps['hoverStopPropagation']>,
  onTap: Function as PropType<ButtonProps['onTap']>,
}

export type ButtonPropKeys = Array<keyof typeof buttonSharedProps>

export const buttonPropKeys = Object.keys(
  buttonSharedProps
) as ButtonPropKeys
