import { ref, Ref, computed, watchEffect, type ComputedRef } from 'vue'
import type { NavBarInstance, NavBarConfig } from '@/components/nav-bar'
import { createInjectionKey } from '@/components/_utils/basic'
import { useChildren } from '../relation/children'

export interface NavBarContextProvide {
  readonly context: Ref<NavBarInstance>
  readonly height: ComputedRef<number>
}

export const NAV_BAR_CONTEXT_KEY = createInjectionKey<NavBarContextProvide>('nav-bar-context')

export const useNavBarContext = (props?: NavBarConfig) => {
  const { linkChildren, children } = useChildren<NavBarInstance>(NAV_BAR_CONTEXT_KEY)

  const context = ref<NavBarInstance>()
  const height = computed(() =>
    context.value?.height.value || 0
  )

  const setConfig = (partial: NavBarConfig) => {
    context.value?.setConfig(partial)
  }

  const unwatch = watchEffect(() => {
    if (children.length) {
      context.value = children[0]
      if (props) {
        context.value?.setConfig(props)
      }
      unwatch()
    }
  })

  linkChildren()

  return { context, height, setConfig }
}
