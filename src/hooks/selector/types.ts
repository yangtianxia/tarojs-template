import type { DOMRect } from './utils'

export type SelectorElement = string | (() => string)

export interface RectOptions {
  useCache?: boolean
  flush?: 'pre' | 'post'
  target?: TaroGeneral.IAnyObject
}

export interface SingleRectOptions<K> extends RectOptions {
  refs?: K[]
  observe?: string | boolean
  triggerCallback?: Callback<DOMRect>
}

export interface AllRectOptions extends RectOptions {
  triggerCallback?: Callback<DOMRect[]>
}
