import type { PageRoute } from '../types'
import { shallowMerge } from '@txjs/shared'
import { isNil, isArray } from '@txjs/bool'
import { pathParser } from '@/shared/query-string'
import { isLogin } from '@/shared/auth'

class createRoute<T extends readonly any[]> {
  #route: Omit<PageRoute, 'children'>[] = []
  #names: Record<string, Readonly<PageRoute>> = {}
  #paths: Record<string, Readonly<PageRoute>> = {}

  constructor(private readonly sourceRoutes: T) {
    this.#route = this.#generate(this.sourceRoutes)
    this.#init()
  }

  #init() {
    this.#route.forEach((route) => {
      this.#names[route.name] = route
      this.#paths[route.path] = route
    })
  }

  #generate(routes: T, ...parents: PageRoute[]) {
    return routes.reduce(
      (list, route) => {
        if (route.path) {
          if (parents.length) {
            route.path = `/${parents.map((item) => item.alias ?? item.name).join('/')}${route.path}`
          }
          list.push(route)
        }

        if (isArray(route.children)) {
          list.push(...this.#generate(route.children, ...parents, route))
        }

        return list
      }, [] as Omit<PageRoute, 'children'>[]
    )
  }

  getRoute(value: string): PageRoute | undefined {
    let route: PageRoute | undefined

    if (value in this.#names) {
      route = this.#names[value]
    } else {
      value = pathParser(value).path

      if (value in this.#paths) {
        route = this.#paths[value]
      }
    }

    return route ? shallowMerge({}, route) : undefined
  }

  getPermission(name: string): number {
    const route = this.getRoute(name)
    let code = 200

    // 自行添加拦截逻辑
    // 路由不存在
    if (isNil(route)) {
      code = 404
    } else if (
      // 需要访问令牌
      // 且未登录
      (isNil(route.requiresAuth) || route.requiresAuth) &&
      !isLogin()
    ) {
      code = 401
    }

    return code
  }
}

export default createRoute
