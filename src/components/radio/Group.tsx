import type { CheckerDirection } from '../checkbox/Checker'

import BEM from '@/shared/bem'
import { defineComponent, watch, type PropType, type ExtractPropTypes, type InjectionKey } from 'vue'

import { useChildren, useFieldValue } from '../composables'
import { numericProp, unknownProp } from '../utils'

const [name, bem] = BEM('radio-group')

export type RadioGroupDirection = CheckerDirection

export const radioGroupProps = {
  disabled: Boolean,
  iconSize: numericProp,
  value: unknownProp,
  direction: String as PropType<RadioGroupDirection>,
  onChange: Function as PropType<(value: unknown) => void>,
  'onUpdate:value': Function as PropType<(value: unknown) => void>
}

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>

export type RadioGroupProvide = {
  props: RadioGroupProps
  updateValue: (value: unknown) => void
}

export const RADIO_KEY: InjectionKey<RadioGroupProvide> = Symbol(name)

export default defineComponent({
  name,

  props: radioGroupProps,

  setup(props, { emit, slots }) {
    const { linkChildren } = useChildren(RADIO_KEY)

    const updateValue = (value: unknown) => emit('update:value', value)

    watch(
      () => props.value,
      (value) => props.onChange?.(value)
    )

    linkChildren({ props, updateValue })

    useFieldValue(() => props.value)

    return () => (
      <view
        role="radiogroup"
        class={bem([props.direction])}
      >
        {slots.default?.()}
      </view>
    )
  }
})
