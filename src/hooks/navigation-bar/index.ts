import { ref, Ref, computed, watchEffect, type ComputedRef, type InjectionKey } from 'vue'
import type { NavigationBarConfig, NavigationBarInstance } from '@/components/navigation-bar'
import { useChildren } from '@/components/composables/children'

export interface UseNavigationBarProvide {
  readonly ctx: Ref<NavigationBarInstance>
  readonly height: ComputedRef<number>
}

export const USE_NAVIGATION_BAR: InjectionKey<UseNavigationBarProvide> = Symbol('use-navigation-bar')

export const useNavigationBar = (config?: NavigationBarConfig) => {
  const ctx = ref<NavigationBarInstance>()
  const { linkChildren, children } = useChildren<NavigationBarInstance>(USE_NAVIGATION_BAR)

  const height = computed(() =>
    ctx.value?.height.value || 0
  )

  const setConfig = (config: NavigationBarConfig) => {
    ctx.value?.setConfig(config)
  }

  const unwatch = watchEffect(() => {
    if (children.length) {
      ctx.value = children[0]
      if (config) {
        ctx.value?.setConfig(config)
      }
      unwatch()
    }
  })

  linkChildren()

  return { height, setConfig, ctx }
}
