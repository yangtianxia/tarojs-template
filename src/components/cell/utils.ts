import type { PropType, CSSProperties } from 'vue'
import type { ViewProps } from '@tarojs/components'
import type { CellSize, CellArrowDirection } from './types'
import { numericProp, iconProp, vnodeProp, truthProp, unknownProp } from '../utils'

export const cellSharedProps = {
  icon: iconProp,
  title: vnodeProp,
  value: vnodeProp,
  label: vnodeProp,
  shrink: truthProp,
  center: Boolean,
  isLink: Boolean,
  required: Boolean,
  rightIcon: iconProp,
  valueClass: unknownProp,
  labelClass: unknownProp,
  titleClass: unknownProp,
  titleWidth: numericProp,
  titleStyle: null as unknown as PropType<CSSProperties>,
  size: String as PropType<CellSize>,
  arrowDirection: String as PropType<CellArrowDirection>,
  onTap: Function as PropType<ViewProps['onTap']>,
  clickable: {
    type: Boolean as PropType<boolean | null>,
    default: null
  },
  border: {
    type: Boolean as PropType<boolean | null>,
    default: null
  }
}
