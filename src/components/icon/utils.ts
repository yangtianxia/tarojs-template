import type { PropType } from 'vue'
import { makeNumericProp } from '../_utils/props'

export const iconSharedProps = {
  icon: String as PropType<IconTypes>,
  iconSize: makeNumericProp(16)
}

export type IconPropKeys = Array<keyof typeof iconSharedProps>

export const iconPropKeys = Object.keys(
  iconSharedProps
) as IconPropKeys
