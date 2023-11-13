import type { InjectionKey } from 'vue'

export const createInjectionKey = <T = any>(value?: Numeric): InjectionKey<T> => {
  return Symbol(value)
}
