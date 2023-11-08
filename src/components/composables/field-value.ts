// copy vant-weapp
import type { FieldValidateTrigger } from '../form/types'
import { watch, inject, type Ref, type InjectionKey } from 'vue'

export type CustomFieldInjectionValue = {
  customValue: Ref<(() => unknown) | undefined >
  resetValidation: () => void
  validateWithTrigger: (trigger: FieldValidateTrigger) => void
}

export const FIELD_INJECTION_KEY: InjectionKey<CustomFieldInjectionValue> = Symbol('field')

export function useFieldValue(customValue: () => unknown) {
  const field = inject(FIELD_INJECTION_KEY, null)

  if (field && !field.customValue.value) {
    field.customValue.value = customValue

    watch(
      customValue,
      () => {
        field.resetValidation()
        field.validateWithTrigger('onChange')
      }
    )
  }
}
