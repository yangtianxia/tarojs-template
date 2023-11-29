import type { ResultStatusType } from '@/components/result'

export type Query = Record<string, any>

export type RouterQuery = string | Query

interface RouteMetaBase {
  readonly name: string
  readonly alias?: string
  readonly path: string
  readonly roles?: string[]
  requiresAuth?: boolean
  title: string
  query?: Query
}

export interface RouteMeta extends RouteMetaBase {
  children?: RouteMeta[]
  beforeEnter?: (
    payload: {
      query: Query,
      options: RouteMetaBase
    }
  ) => {
    validator?: () => false | Error | ResultStatusType | undefined
    options: RouteMetaBase
  }
}

