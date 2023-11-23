import type { InjectionKey } from 'vue'
import type { VNode } from './types'
import { isFunction } from '@txjs/bool'

export type GenVNodeReturn = ReturnType<typeof genVNode>

export const createInjectionKey = <T = any>(value?: Numeric): InjectionKey<T> => {
  return Symbol(value)
}

export const genVNode = (
  vnode?: string | VNode,
  options?: {
    extra?: Record<any, any>
    render?: Callback<string>
  }
) => {
  if (vnode) {
    const { extra = {}, render } = options || {}
    return isFunction(vnode)
      ? vnode(extra)
      : render
        ? render(vnode)
        : vnode
  }
}
