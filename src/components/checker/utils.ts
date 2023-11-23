import type { ITouchEvent } from '@tarojs/components'
import type { PropType } from 'vue'
import type { CheckerShape, CheckerLabelPosition } from './types'
import { unknownProp, numericProp, makeStringProp } from '../utils'

export const checkerSharedProps = {
  name: unknownProp,
  disabled: Boolean,
  iconSize: numericProp,
  value: unknownProp,
  checkedColor: String,
  labelDisabled: Boolean,
  shape: makeStringProp<CheckerShape>('round'),
  labelPosition: String as PropType<CheckerLabelPosition>,
  onTap: Function as PropType<(event: ITouchEvent) => void>
}
