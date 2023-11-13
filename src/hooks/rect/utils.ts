export const makeDOMRect = () => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
})

export type RectElement = string | (() => string)

export type DOMRect = ReturnType<typeof makeDOMRect>

export type DOMRectKey = keyof DOMRect

export interface RectOptions {
  flush?: 'pre' | 'post'
  target?: TaroGeneral.IAnyObject
}

export interface SingleRectOptions<K> extends RectOptions {
  refs?: K[]
  triggerCallback?: Callback<DOMRect>
}

export interface AllRectOptions extends RectOptions {
  triggerCallback?: Callback<DOMRect[]>
}
