import type { ComponentPublicInstance, ComputedRef } from 'vue'
import type { CheckboxProps } from './Checkbox'
import type { CheckboxGroupProps } from './Group'
import type { CheckerParent, CheckerShape, CheckerDirection, CheckerLabelPosition } from '../checker/types'

export type CheckboxGroupDirection = CheckerDirection
export type CheckboxGroupToggleAllOptions =
  | boolean
  | {
    checked?: boolean
    skipDisabled?: boolean
  }

export type CheckboxGroupExpose = {
  toggleAll: (options?: CheckboxGroupToggleAllOptions) => void
}

export type CheckboxGroupProvide = CheckerParent & {
  props: CheckboxGroupProps
  updateValue: (value: unknown[]) => void
}

export type CheckboxShape = CheckerShape
export type CheckboxLabelPosition = CheckerLabelPosition

export type CheckboxExpose = {
  toggle: (newValue?: boolean) => void
  /** @private */
  props: CheckboxProps
  /** @private */
  checked: ComputedRef<boolean>
}

export type CheckboxGroupInstance = ComponentPublicInstance<CheckboxGroupProps, CheckboxGroupExpose>
export type CheckboxInstance = ComponentPublicInstance<CheckboxProps, CheckboxExpose>
