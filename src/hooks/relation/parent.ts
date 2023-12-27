import {
  ref,
  inject,
  computed,
  onUnmounted,
  getCurrentInstance,
  type InjectionKey,
  type ComponentPublicInstance,
  type ComponentInternalInstance
} from 'vue'

type ParentProvide<T> = T & {
  link(child: ComponentInternalInstance, costom?: boolean): void
  unlink(child: ComponentInternalInstance): void
  children: ComponentPublicInstance[]
  customChildren: ComponentPublicInstance[]
  internalChildren: ComponentInternalInstance[]
  customInternalChildren: ComponentInternalInstance[]
}

export function useParent<T>(key: InjectionKey<ParentProvide<T>>) {
  const parent = inject(key, null)

  if (parent) {
    const instance = getCurrentInstance()!
    const { link, unlink, internalChildren } = parent
    const index = computed(() => internalChildren.indexOf(instance))

    link(instance)
    onUnmounted(() => unlink(instance))
    return { parent, index }
  }

  return {
    parent: null,
    index: ref(-1)
  }
}
