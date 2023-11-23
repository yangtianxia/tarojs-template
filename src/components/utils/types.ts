import type { VNode as _VNode, ComponentPublicInstance } from 'vue'

export interface CustomShim<T> {
  new (...args: any[]): {
    $props: T
  }
}

export type VNodeChildAtom =
  | _VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void

export type VueEmit = (event: any, ...args: any[]) => void

export type VNode = (...args: any) => VNodeChildAtom | VNodeChildAtom[] | JSX.Element

export type ComponentInstance = ComponentPublicInstance<Record<string, any>, any>
