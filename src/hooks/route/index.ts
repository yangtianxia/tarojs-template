import type { ResultProps } from '@/components/result'
import type { Query } from '@/router/types'

import extend from 'extend'
import router from '@/router'
import { ref } from 'vue'
import { getCurrentInstance } from '@tarojs/taro'

export const USE_ROUTE_KEY = Symbol('use-route')

const getCurrentRoute = (pageInstance?: ReturnType<typeof getCurrentInstance>) => {
  const pageRouter = pageInstance?.router!
  const currentRoute = ref(
    extend({}, router.getRoute(pageRouter.path), {
      title: pageInstance?.page?.config?.navigationBarTitleText
    })
  )

  const activeUpdate = (query?: Query) => {
    const { beforeEnter } = currentRoute.value || {}

    if (beforeEnter) {
      pageRouter.params = extend(true, pageRouter.params, query)

      const { validator, options } = beforeEnter({
        options: currentRoute.value!,
        query: pageRouter.params
      })

      currentRoute.value = extend(true, currentRoute.value, options)

      let status: ResultProps | undefined

      try {
        const verified = validator?.()

        if (verified === false) {
          throw new Error('访问异常，请重新试试！')
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

  return { ...pageRouter, pageInstance, currentRoute, activeUpdate }
}

export const useRoute = () => {
  const instance = getCurrentInstance()

  // 路由信息挂载到当前页面实例，防止调用结果不一致
  // 若没有页面实例则直接返回路由信息
  if (instance.page) {
    if (!instance.page[USE_ROUTE_KEY]) {
      instance.page[USE_ROUTE_KEY] = getCurrentRoute(instance)
    }
    return instance.page[USE_ROUTE_KEY]
  }

  return getCurrentRoute(instance)
}
