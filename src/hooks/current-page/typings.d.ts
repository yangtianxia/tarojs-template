import '@tarojs/taro'
import type { PageRoute } from '@/router/types'
import type { Ref } from 'vue'
import type { CURRENT_PAGE_SYMBOL, CurrentInstance } from '.'
import type { ResultStatus } from '@/components/result'
import type { URLParams } from '@/shared/query-string'

type CurrentInstancePartial = NonNullableFields<
  Pick<CurrentInstance,
    | 'app'
    | 'router'
    | 'page'
    | 'preloadData'
  >
>

declare interface CurrentRoute extends CurrentInstancePartial {
  currentRoute: Ref<PageRoute>,
  validator(query?: URLParams): ResultStatus | undefined
}

declare module '@tarojs/taro' {
  interface PageInstance {
    [CURRENT_PAGE_SYMBOL]: CurrentRoute
  }

  interface AppInstance {
    config?: Taro.Config
  }
}
