import type { SelectorElement } from './types'
import { isFunction } from '@txjs/bool'

export type DOMRect = ReturnType<typeof makeDOMRect>

export const makeDOMRect = () => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
})

export const getSelectorElement = (element: SelectorElement) => {
  return isFunction(element) ? element() : element
}
