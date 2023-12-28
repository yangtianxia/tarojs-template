import type { URLParams } from './query-string'
import { useRouter } from '@tarojs/taro'
import { isNil } from '@txjs/bool'
import { REDIRECT_URI } from '@/shared/constants'
import { queryStringify } from '@/shared/query-string'

export function jumpLogin(
  path?: string,
  params: URLParams = {},
  linkType: 'navigateTo' | 'redirectTo' = 'navigateTo'
) {
  const login = router.getRoute('login')

  if (isNil(path)) {
    const router = useRouter()
    path = router.path
    params = router.params
    linkType = 'redirectTo'
  }

  if (isNil(login) || path.startsWith(login.path)) return

  if (router.checkTabbar(path)) {
    router.navigateTo(login.path)
  } else {
    router[linkType](login.path, {
      [REDIRECT_URI]: encodeURIComponent(
        [path, queryStringify(params)].join('')
      )
    })
  }
}
