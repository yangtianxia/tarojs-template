import type { DOMRect } from './utils'

export type SelectorElement = string | (() => string)

export interface RectOptions {
  immediate?: boolean
  useCache?: boolean
  flush?: 'pre' | 'post'
  target?: TaroGeneral.IAnyObject
}

export interface SingleRectOptions<K> extends RectOptions {
  refs?: K[]
  observe?: string | boolean
  callback?: UnknownCallback<DOMRect>
}

export interface AllRectOptions extends RectOptions {
  callback?: UnknownCallback<DOMRect[]>
}
