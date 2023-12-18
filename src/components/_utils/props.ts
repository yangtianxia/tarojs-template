import type { PropType } from 'vue'
import type { VNode } from './types'

export const numericProp = [Number, String]

export const unknownProp = (null as unknown) as PropType<unknown>

export const VNodeProp = [String, Function] as PropType<string | VNode>

export const truthProp = {
  type: Boolean,
  default: true as const
}

export const makeRequiredProp = <T,>(type: T) => ({
  type,
  required: true as const
})

export const makeArrayProp = <T,>() => ({
  type: Array as PropType<T[]>,
  default: () => [] as T[]
})

export const makeNumberProp = <T,>(defaultVal: T) => ({
  type: Number,
  default: defaultVal
})

export const makeNumericProp = <T,>(defaultVal: T) => ({
  type: numericProp,
  default: defaultVal
})

export const makeStringProp = <T,>(defaultVal: T) => ({
  type: String as unknown as PropType<T>,
  default: defaultVal
})
