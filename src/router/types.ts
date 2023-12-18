import type { ResultStatus } from '@/components/result'
import type { URLParams } from '@/shared/query-string'

interface PageRouteBase {
  readonly name: string
  readonly alias?: string
  readonly path: string
  readonly roles?: string[]
  requiresAuth?: boolean
  title: string
  query?: URLParams
}

export interface PageRoute extends PageRouteBase {
  children?: PageRoute[]
  beforeEnter?: (
    payload: {
      query: URLParams,
      options: PageRoute
    }
  ) => {
    validator?: () => false | Error | ResultStatus | undefined
    options: PageRouteBase
  }
}
