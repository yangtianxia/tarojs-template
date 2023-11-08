import type { PropType } from 'vue'
import type { Interceptor } from '@txjs/shared'
import type { RouterQuery, RouterLinkType } from '@/router/types'

import router from '@/router'
import { isNil, isString, isFunction } from '@txjs/bool'

export const jumpLinkSharedProps = {
  url: String,
  linkQuery: [String, Object] as PropType<RouterQuery>,
  linkType: String as PropType<RouterLinkType>,
  linkBefore: Function as PropType<Interceptor>
}

const jumpLinkImplement = (
  path: string,
  query?: RouterQuery,
  interceptor?: Interceptor,
  linkType: RouterLinkType = 'navigateTo'
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
  query?: RouterQuery,
  linkType?: RouterLinkType | Interceptor,
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
