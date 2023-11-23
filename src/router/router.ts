import extend from 'extend'
import { noop, cloneDeep, callInterceptor, interceptorAll, type Interceptor } from '@txjs/shared'
import { isNil, isArray, isPlainObject, isFunction } from '@txjs/bool'
import { useUserStore } from '@/store'
import { useAppConfig } from '@/hooks/app-config'
import { REDIRECT_URI } from '@/hooks/redirect'
import { isLogin } from '@/shared/auth'
import { cutPath, queryStringify, queryParse } from '@/shared/query-router'

import {
  getCurrentPages,
  useRouter as taroUseRouter,
  switchTab as taroSwitchTab,
  reLaunch as taroRreLaunch,
  redirectTo as taroRedirectTo,
  navigateTo as taroNavigateTo,
  navigateBack as taroNavigateBack
} from '@tarojs/taro'

import { ERROR_ROUTE } from './routes/base'
import type { RouteMeta, RouterQuery } from './types'

export type RouterPath = string

export type RouterLinkType = 'navigateTo' | 'reLaunch' | 'redirectTo' | 'switchTab'

export type RouterOption<T = RouterPath> = {
  path: T,
  query?: RouterQuery,
  beforeEnter?: Interceptor
}

interface RouterInterceptor {
  (option: RouteMeta): ReturnType<Interceptor>
}

interface RouterJump {
  (path: string | RouterOption<string>): void
  (path: RouterPath | RouterOption): void
  (path: string, query?: RouterQuery): void
  (path: RouterPath, query?: RouterQuery): void
  (path: string, beforeEnter?: Interceptor): void
  (path: RouterPath, beforeEnter?: Interceptor): void
}

class Router<T extends readonly any[]> {
  private routes: Omit<RouteMeta, 'children'>[]
  private names: Record<string, Readonly<RouteMeta>> = {}
  private paths: Record<string, Readonly<RouteMeta>> = {}
  private interceptor?: RouterInterceptor
  private appConfigBase?: ReturnType<typeof useAppConfig>

  constructor(private readonly sourceRoutes: T) {
    this.routes = this.flat(this.sourceRoutes)
    this.init()
  }

  get appConfig() {
    this.appConfigBase ??= useAppConfig()
    return this.appConfigBase
  }

  private init() {
    this.routes.forEach((route) => {
      this.names[route.name] = route
      this.paths[route.path] = route
    })
  }

  private flat(routes: T, ...parents: RouteMeta[]) {
    return routes.reduce(
      (list, route) => {
        if (route.path) {
          if (parents.length) {
            route.path = `/${parents.map((item) => item.alias ?? item.name).join('/')}${route.path}`
          }
          list.push(route)
        }

        if (isArray(route.children)) {
          list.push(...this.flat(route.children, ...parents, route))
        }

        return list
      }, [] as Omit<RouteMeta, 'children'>[]
    )
  }

  private route<T extends Function>(iteratee: T, switchTab = false): RouterJump {
    const callback = (
      path:
        | string
        | RouterPath
        | RouterOption
        | RouterOption<string>,
      query?: RouterQuery,
      beforeEnter?: Interceptor
    ) => {
      if (isPlainObject(path)) {
        query = path?.query
        beforeEnter = path?.beforeEnter
        path = path.path
      }

      if (isFunction(query)) {
        beforeEnter = query
        query = undefined
      }

      const result = cutPath(path)
      const route = this.getRoute(result.path) || ERROR_ROUTE

      // 合并参数
      route.query = extend({}, result.query, queryParse(query))

      callInterceptor(interceptorAll, {
        canceled: noop,
        args: [[this.interceptor, beforeEnter], route],
        done: () => {
          const url = [route.path]

          if (!switchTab) {
            url.push(
              queryStringify(route.query)!
            )
          }

          iteratee({
            url: url.join('')
          })
        }
      })
    }
    return callback
  }

  beforeEnter(interceptor: RouterInterceptor) {
    this.interceptor = interceptor
  }

  checkTabbar(path: string) {
    return this.appConfig?.tabBar?.list?.some((tab) => path.indexOf(tab.pagePath) !== -1) ?? false
  }

  getPermission(name: string): number {
    const route = this.getRoute(name)
    let code = 200

    // 自行添加拦截逻辑
    if (isNil(route)) {
      code = 404
    } else if (
      (isNil(route.requiresAuth) || route.requiresAuth) &&
      !isLogin()
    ) {
      code = 401
    }

    return code
  }

  getCurrentPages() {
    return getCurrentPages()
  }

  getRoute(value: string): RouteMeta | undefined {
    let route: RouteMeta | undefined

    if (value in this.names) {
      route = this.names[value]
    } else {
      value = cutPath(value).path

      if (value in this.paths) {
        route = this.paths[value]
      }
    }

    return route ? cloneDeep(route) : undefined
  }

  jumpLogin(
    path?: string,
    params: Record<string, any> = {},
    linkType: 'navigateTo' | 'redirectTo' = 'navigateTo'
  ) {
    const login = this.getRoute('login')

    if (isNil(path)) {
      const router = taroUseRouter()
      path = router.path
      params = router.params
      linkType = 'redirectTo'
    }

    if (isNil(login) || path.startsWith(login.path)) return

    const userStore = useUserStore()

    if (this.checkTabbar(path)) {
      this.navigateTo(login.path)
    } else {
      this[linkType](login.path, {
        [REDIRECT_URI]: encodeURIComponent(
          [path, queryStringify(params)].join('')
        )
      })
    }

    userStore.logoutCallback()
  }

  private navigateToBase = this.route(taroNavigateTo)

  navigateTo: RouterJump = (...args: Parameters<typeof this.navigateToBase>) => {
    if (this.getCurrentPages().length > 9) {
      this.redirectTo(...args)
    } else {
      this.navigateToBase(...args)
    }
  }

  navigateBack(delta = 1) {
    if (this.getCurrentPages().length > 1) {
      taroNavigateBack.apply(null, [delta])
    } else {
      this.reLaunch(this.appConfig.pages![0])
    }
  }

  switchTab = this.route(taroSwitchTab, true)

  reLaunch = this.route(taroRreLaunch)

  redirectTo = this.route(taroRedirectTo)
}

export default Router
