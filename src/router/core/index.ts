import Taro from '@tarojs/taro'
import { shallowMerge, callInterceptor, interceptorAll, noop, type Interceptor } from '@txjs/shared'
import { makeArray } from '@txjs/make'
import { isFunction, isNil, isPlainObject } from '@txjs/bool'
import { useAppConfig } from '@/hooks/app-config'
import { pathParser, queryParser, queryStringify, type URLParams } from '@/shared/query-string'
import type { PageRoute } from '../types'
import { ERROR_ROUTE } from '../routes/basic'
import createRoute from './route'

export type NavigateType = 'navigateTo' | 'reLaunch' | 'redirectTo' | 'switchTab'

export type NavigateOption = {
  path: string,
  query?: string | URLParams,
  beforeEnter?: Interceptor
}

interface NavigateInterceptor {
  (option: PageRoute): ReturnType<Interceptor>
}

interface NavigateCallback {
  (path: string | NavigateOption): void
  (path: string, query?: string | URLParams): void
  (path: string, beforeEnter?: Interceptor): void
}

class createRouter<T extends readonly any[]> extends createRoute<T> {
  #interceptor = makeArray<NavigateInterceptor>([])
  #appConfig?: ReturnType<typeof useAppConfig>

  constructor (sourceRoutes: T) {
    super(sourceRoutes)
  }

  get appConfig() {
    if (isNil(this.#appConfig)) {
      this.#appConfig = useAppConfig()
    }
    return this.#appConfig
  }

  #navigate<T extends Function>(navigateFn: T, switchTab = false): NavigateCallback {
    return (
      path: string | NavigateOption,
      query?: string | URLParams | Interceptor
    ) => {
      let beforeEnter: Interceptor | undefined

      if (isPlainObject(path)) {
        query = path.query
        beforeEnter = path.beforeEnter
        path = path.path
      } else if (isFunction(query)) {
        beforeEnter = query
        query = undefined
      }

      const result = pathParser(path)
      const route = this.getRoute(result.path) || ERROR_ROUTE

      // 合并路由参数
      route.query = shallowMerge({}, result.params, queryParser(query))

      // 跳转之前拦截
      callInterceptor(interceptorAll, {
        canceled: noop,
        args: [[...this.#interceptor, beforeEnter], route],
        done: () => {
          const option = [route.path]

          if (!switchTab) {
            option.push(
              queryStringify(route.query)!
            )
          }

          navigateFn({ url: option.join('') })
        }
      })
    }
  }

  getPages() {
    return Taro.getCurrentPages()
  }

  checkTabbar(path?: string) {
    if (isNil(path)) {
      return false
    }
    return this.appConfig?.tabBar?.list?.some((tab) => path.indexOf(tab.pagePath) !== -1) ?? false
  }

  beforeEnter(interceptor: NavigateInterceptor) {
    this.#interceptor.push(interceptor)
  }

  #navigateTo = this.#navigate(Taro.navigateTo)

  navigateTo: NavigateCallback = (...args: any[]) => {
    if (Taro.getCurrentPages().length > 9) {
      this.redirectTo.apply(null, args)
    } else {
      this.#navigateTo.apply(null, args)
    }
  }

  navigateBack(delta = 1) {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack.apply(null, [delta])
    } else {
      this.reLaunch(this.appConfig.pages![0])
    }
  }

  switchTab = this.#navigate(Taro.switchTab, true)

  reLaunch = this.#navigate(Taro.reLaunch)

  redirectTo = this.#navigate(Taro.redirectTo)
}

export default createRouter
