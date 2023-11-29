import '@tarojs/taro'
import router from '@/router'
import { useRouter, getCurrentInstance } from '@tarojs/taro'
import type { Ref } from 'vue'
import type { USE_ROUTE_KEY } from '.'
import type { ResultStatusType } from '@/components/result'
import type { Query } from '@/router/types'

declare interface CurrentRoute extends ReturnType<typeof useRouter> {
  pageInstance?: ReturnType<typeof getCurrentInstance>,
  currentRoute: Ref<ReturnType<typeof router.getRoute>>,
  activeUpdate(query?: Query): ResultStatusType | undefined
}

declare module '@tarojs/taro' {
  interface PageInstance {
    [USE_ROUTE_KEY]: CurrentRoute
  }

  interface AppInstance {
    config?: Taro.Config
  }
}
