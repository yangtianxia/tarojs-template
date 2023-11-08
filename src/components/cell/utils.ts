import type { PropType, CSSProperties } from 'vue'
import type { ViewProps } from '@tarojs/components'
import type { IconName } from '../icon'
import type { CellSize, CellArrowDirection } from './types'
import { numericProp, truthProp, unknownProp } from '../utils'

export const cellSharedProps = {
  icon: String as PropType<IconName>,
  size: String as PropType<CellSize>,
  title: numericProp,
  value: numericProp,
  label: numericProp,
  shrink: truthProp,
  center: Boolean,
  isLink: Boolean,
  border: truthProp,
  required: Boolean,
  valueClass: unknownProp,
  labelClass: unknownProp,
  titleClass: unknownProp,
  titleWidth: numericProp,
  titleStyle: null as unknown as PropType<CSSProperties>,
  arrowDirection: String as PropType<CellArrowDirection>,
  onTap: Function as PropType<ViewProps['onTap']>,
  clickable: {
    type: Boolean as PropType<boolean | null>,
    default: null
  }
}
