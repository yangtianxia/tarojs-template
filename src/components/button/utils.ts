import type { PropType } from 'vue'
import type { ButtonProps } from '@tarojs/components'
import type { ButtonSize, ButtonType, ButtonIconPosition } from './types'
import { truthProp, numericProp, iconProp, vnodeProp, makeNumericProp, makeStringProp } from '../utils'

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
  bold: truthProp,
  width: numericProp,
  text: vnodeProp,
  loadingText: vnodeProp,
  icon: iconProp,
  iconSize: makeNumericProp(14),
  type: makeStringProp<ButtonType>('light'),
  size: makeStringProp<ButtonSize>('normal'),
  iconPosition: makeStringProp<ButtonIconPosition>('left'),
  onTap: Function as PropType<ButtonProps['onTap']>,
}

export type ButtonPropKeys = Array<keyof typeof buttonSharedProps>

export const buttonPropKeys = Object.keys(
  buttonSharedProps
) as ButtonPropKeys
