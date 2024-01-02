import type { ElementAttrs, TransformReact2VueType, StandardProps, ITouchEvent } from '@tarojs/components/types/index.vue3'
import type { VNode as _VNode, ComponentPublicInstance } from 'vue'

export type EventEmits = {
  onTap?: UnknownCallback<ITouchEvent>
}

export type JSXShim<T extends Record<string, any>> =
  & EventEmits
  & ElementAttrs<
    & TransformReact2VueType<
      & Partial<T>
      & StandardProps
    >
  >

export type VNodeChildAtom = _VNode | string | number | boolean | null | undefined | void

export type VueEmit = (event: any, ...args: any[]) => void

export type VNode = (...args: any) => VNodeChildAtom | VNodeChildAtom[] | JSX.Element

export type ComponentInstance = ComponentPublicInstance<Record<string, any>, any>
