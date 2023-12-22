import { ref } from 'vue'
import { getCurrentInstance } from '@tarojs/taro'
import { shallowMerge } from '@txjs/shared'
import _router from '@/router'
import type { ResultStatus } from '@/components/result'
import type { URLParams } from '@/shared/query-string'

export type CurrentInstance = ReturnType<typeof getCurrentInstance>

export const CURRENT_PAGE_SYMBOL = Symbol('current-page')

const getCurrentPage = (context: CurrentInstance) => {
  const router = context.router!
  const page = context.page!
  const app =  context.app!
  const preloadData = context.preloadData!
  const route = _router.getRoute(router.path)

  const currentRoute = ref(
    shallowMerge({}, route, {
      title: page.config?.navigationBarTitleText
    })
  )

  const validator = (query?: URLParams) => {
    const { beforeEnter } = currentRoute.value || {}

    if (beforeEnter) {
      router.params = shallowMerge({}, router.params, query)

      const { validator, options } = beforeEnter({
        options: currentRoute.value!,
        query: router.params
      })

      shallowMerge(currentRoute.value, options)

      let status: ResultStatus | undefined

      try {
        const verified = validator?.()
        if (verified === false) {
          throw new Error($t('hooks.current.page.error'))
        } else if (!(verified instanceof Error)) {
          status = verified
        }
      } catch (err) {
        status = {
          status: 'error',
          desc: err.message
        }
      }

      return status
    }
  }

  return { app, page, router, preloadData, currentRoute, validator }
}

export const useCurrentPage = () => {
  const context = getCurrentInstance()
  // 路由信息挂载到当前页面实例，防止调用结果不一致
  let currentPage = context.page![CURRENT_PAGE_SYMBOL]

  if (!currentPage) {
    currentPage = context.page![CURRENT_PAGE_SYMBOL] = getCurrentPage(context)
  }

  return currentPage
}
