import type { PropType } from 'vue'
import type { Interceptor } from '@txjs/shared'
import type { URLParams } from '@/shared/query-string'
import type { NavigateType } from '@/router/core'
import { isNil, isString, isFunction } from '@txjs/bool'

export const jumpLinkSharedProps = {
  url: String,
  linkQuery: [String, Object] as PropType<string | URLParams>,
  linkType: String as PropType<NavigateType>,
  linkBefore: Function as PropType<Interceptor>
}

const jumpLinkImplement = (
  path: string,
  query?: string | URLParams,
  interceptor?: Interceptor,
  linkType: NavigateType = 'navigateTo'
) => {
  if (isNil(path)) return

  router[linkType]({
    path,
    query,
    beforeEnter: interceptor
  })
}

export const jumpLink = (
  url: string,
  query?: string | URLParams,
  linkType?: NavigateType | Interceptor,
  interceptor?: Interceptor
) => {
  if (isFunction(linkType)) {
    interceptor = linkType
  }

  jumpLinkImplement(
    url,
    query,
    interceptor,
    isString(linkType) ? linkType : undefined
  )
}
