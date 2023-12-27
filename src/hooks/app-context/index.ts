import { reactive } from 'vue'
import { isString } from '@txjs/bool'
import type { URLParams } from '@/shared/query-string'
import type { ResultOptions, ResultStatus } from '@/components/result'
import { createInjectionKey } from '@/components/_utils/basic'
import { useCurrentPage } from '../current-page'
import { useChildren } from '../relation/children'

interface AppContextOption {
  loading?: boolean
  status?: ResultStatus
}

export interface AppContextProvide {
  state: {
    loading: boolean
    status?: ResultStatus
  }
}

export const APP_CONTEXT_KEY = createInjectionKey<AppContextProvide>('app-context')

export const useAppContext = (option?: AppContextOption) => {
  const { linkChildren } = useChildren(APP_CONTEXT_KEY)
  const currentPage = useCurrentPage()

  const state = reactive({
    loading: option?.loading ?? true,
    status: option?.status
  })

  const reload = (error: any, callback?: AnyCallback) => {
    if (error.code === 401) return

    let result = { status: error } as ResultOptions
    let errMsg = error.message || error.errMsg || error.msg

    if (isString(error)) {
      result.desc = error
    } else if (errMsg) {
      result.desc = errMsg
    }

    if (callback) {
      result.refresh = () => {
        state.loading = true
        state.status = undefined
        callback?.()
      }
    }

    state.status = result
  }

  const beforeEnter = (callback?: AnyCallback<URLParams>) => {
    const result = currentPage.validator()

    if (result) {
      state.status = result
      state.loading = false
    } else {
      callback?.(currentPage.router.params)
    }
  }

  linkChildren({ state })

  return {
    reload,
    beforeEnter,
    currentPage,
    set loading(value: boolean) {
      state.loading = value
    },
    get loading() {
      return state.loading
    },
    set status(value: ResultStatus | undefined) {
      state.status = value
    },
    get status() {
      return state.status
    }
  }
}
