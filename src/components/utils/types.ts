import type { VNode, ComponentPublicInstance } from 'vue'

export interface CustomShim<T> {
  new (...args: any[]): {
    $props: T
  }
}

export type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void

export type VueNode = VNodeChildAtom | VNodeChildAtom[] | JSX.Element

export type VueEmit = (event: any, ...args: any[]) => void

export type VueSlotVNode = (...args: any) => VueNode

export type ComponentInstance = ComponentPublicInstance<Record<string, any>, any>
