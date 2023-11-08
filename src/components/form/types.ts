import type { ComponentPublicInstance, ComputedRef, Ref } from 'vue'
import type { FormProps } from './Form'
import type { FieldProps } from './Field'

export type FieldType =
  | 'text'
  | 'number'
  | 'idcard'
  | 'digit'
  | 'safe-password'
  | 'nickname'
  | 'textarea'
  | 'password'

export type FieldRequiredAlign = 'left' | 'right'

export type FieldTextAlign = 'left' | 'center' | 'right' | 'top'

export type FieldClearTrigger = 'always' | 'focus'

export type FieldFormatTrigger = 'onBlur' | 'onChange'

export type FieldValidateTrigger = 'onBlur' | 'onChange' | 'onSubmit'

export type FieldValidationStatus = 'passed' | 'failed' | 'unvalidated'

export type FieldFormSharedProps =
  | 'colon'
  | 'shrink'
  | 'disabled'
  | 'readonly'
  | 'titleWidth'
  | 'titleAlign'
  | 'inputAlign'
  | 'requiredAlign'
  | 'errorMessageAlign'

export type FieldAutosizeConfig = {
  maxHeight?: number
  minHeight?: number
}

export type FieldValidateError = {
  name?: string
  message: string
}

export type FieldRuleMessage =
  | string
  | Ref<Error>
  | ((value: any, rule: FieldRule) => string)

export type FieldRuleValidator = (
  value: any,
  rule: FieldRule
) => boolean | string | Promise<boolean | string>

export type FiledRuleFormatter = (value: any, rule: FieldRule) => string

export type FieldRule = {
  pattern?: RegExp
  trigger?: FieldValidateTrigger | FieldValidateTrigger[]
  message?: FieldRuleMessage
  required?: boolean
  validator?: FieldRuleValidator
  formatter?: FiledRuleFormatter
  validateEmpty?: boolean
}

export type FieldExpose = {
  focus: () => void | undefined
  blur: () => void | undefined
  validate: (
    rules?: FieldRule[] | undefined
  ) => Promise<void | FieldValidateError>
  resetValidation: () => void
  getValidationStatus: () => FieldValidationStatus
  /** @private */
  formValue: ComputedRef<unknown>
}

export type FieldInstance = ComponentPublicInstance<FieldProps, FieldExpose>

export type FormExpose = {
  submit: () => void
  validate: (name?: string | string[] | undefined) => Promise<void>
  getValues: () => Record<string, unknown>
  scrollToField: (
    name: string,
    options?: boolean | ScrollIntoViewOptions | undefined
  ) => void
  reset: (name?: string | string[] | undefined) => void
  getValidationStatus: () => Record<string, FieldValidationStatus>
}

export type FormProvide = {
  props: FormProps
} & FormExpose

export type FormInstance = ComponentPublicInstance<FormProps, FormExpose>
