import type { InjectionKey } from 'vue'
import type { VNode } from './types'
import { isFunction } from '@txjs/bool'

export type RenderVNodeReturn = ReturnType<typeof renderVNode>

export const createInjectionKey = <T = any>(value?: Numeric): InjectionKey<T> => {
  return Symbol(value)
}

export const renderVNode = (
  vnode?: string | VNode,
  options?: {
    extra?: Record<any, any>
    render?: AnyCallback<string>
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
