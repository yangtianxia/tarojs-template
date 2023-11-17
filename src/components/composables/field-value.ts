import { watch, inject, type Ref } from 'vue'
import type { FieldValidateTrigger } from '../form/types'
import { createInjectionKey } from '../utils'

export type CustomFieldInjectionValue = {
  customValue: Ref<(() => unknown) | undefined >
  resetValidation: () => void
  validateWithTrigger: (trigger: FieldValidateTrigger) => void
}

export const FIELD_INJECTION_KEY = createInjectionKey<CustomFieldInjectionValue>('field')

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
