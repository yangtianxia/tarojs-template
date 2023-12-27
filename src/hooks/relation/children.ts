import {
  isVNode,
  provide,
  reactive,
  getCurrentInstance,
  type VNode,
  type InjectionKey,
  type VNodeNormalizedChildren,
  type ComponentPublicInstance,
  type ComponentInternalInstance
} from 'vue'
import { shallowMerge } from '@txjs/shared'

export function flattenVNodes(children: VNodeNormalizedChildren) {
  const result: VNode[] = []
  const traverse = (children: VNodeNormalizedChildren) => {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (isVNode(child)) {
          result.push(child)

          if (child.component?.subTree) {
            result.push(child.component.subTree)
            traverse(child.component.subTree.children)
          }

          if (child.children) {
            traverse(child.children)
          }
        }
      })
    }
  }
  traverse(children)
  return result
}

const findVNodeIndex = (vnodes: VNode[], vnode: VNode) => {
  const index = vnodes.indexOf(vnode)
  if (index === -1) {
    return vnodes.findIndex(
      (item) =>
        vnode.key !== undefined &&
        vnode.key !== null &&
        item.type === vnode.type &&
        item.key === vnode.key
    )
  }
  return index
}

export function sortChildren(
  parent: ComponentInternalInstance,
  publicChildren: ComponentPublicInstance[],
  internalChildren: ComponentInternalInstance[]
) {
  const vnodes = flattenVNodes(parent.subTree.children)

  internalChildren.sort(
    (a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode)
  )

  const orderedPublicChildren = internalChildren.map((item) => item.proxy!)

  publicChildren.sort((a, b) => {
    const indexA = orderedPublicChildren.indexOf(a)
    const indexB = orderedPublicChildren.indexOf(b)
    return indexA - indexB
  })
}

export function useChildren<
  Child extends ComponentPublicInstance = ComponentPublicInstance<{}, any>,
  ProvideValue = never
>(key: InjectionKey<ProvideValue>) {
  const publicChildren: Child[] = reactive([])
  const internalChildren: ComponentInternalInstance[] = reactive([])
  const customPublicChildren: Child[] = reactive([])
  const customInternalChildren: ComponentInternalInstance[] = reactive([])
  const parent = getCurrentInstance()!

  const linkChildren = (value?: ProvideValue) => {
    const internalLink = (
      child: ComponentInternalInstance,
      publicChild: Child[],
      internalChild: ComponentInternalInstance[]
    ) => {
      if (child.proxy) {
        internalChild.push(child)
        publicChild.push(child.proxy as Child)
        sortChildren(parent, publicChild, internalChild)
      }
    }

    const unInternalLink = (
      child: ComponentInternalInstance,
      publicChild: Child[],
      internalChild: ComponentInternalInstance[]
    ) => {
      const index = internalChild.indexOf(child)
      publicChild.splice(index, 1)
      internalChild.splice(index, 1)
    }

    const link = (child: ComponentInternalInstance, custom?: boolean) => {
      const args = custom
        ? [child, customPublicChildren, customInternalChildren] as const
        : [child, publicChildren, internalChildren] as const
      internalLink(...args)
    }

    const unlink = (child: ComponentInternalInstance) => {
      unInternalLink(child, customPublicChildren, customInternalChildren)
      unInternalLink(child, publicChildren, internalChildren)
    }

    provide(
      key,
      shallowMerge(
        {
          link,
          unlink,
          children: publicChildren,
          customChildren: customPublicChildren,
          internalChildren,
          customInternalChildren
        },
        value
      )
    )
  }

  return {
    children: publicChildren,
    customChildren: customPublicChildren,
    linkChildren
  }
}
