import { reactive } from 'vue'
import { isString } from '@txjs/bool'
import type { Query } from '@/router/types'

import type { ResultStatusType, ResultOptions } from '@/components/result'
import { useChildren } from '@/components/composables/children'
import { createInjectionKey } from '@/components/utils'
import { useRoute } from '../route'

interface UsePageOption {
  loading?: boolean
  status?: ResultStatusType
}

export interface UsePageProvide {
  state: {
    loading: boolean
    status?: ResultStatusType
  }
}

export const USE_PAGE_KEY = createInjectionKey<UsePageProvide>('use-page')

export const usePage = (options?: UsePageOption) => {
  const { linkChildren } = useChildren(USE_PAGE_KEY)

  const page = useRoute()
  const state = reactive({
    loading: options?.loading ?? true,
    status: options?.status
  })

  const reload = (error: any, callback?: Callback) => {
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

  const beforeEnter = (callback?: Callback<Query>) => {
    const result = page.activeUpdate()

    if (result) {
      state.status = result
      state.loading = false
    } else {
      callback?.(page.params)
    }
  }

  linkChildren({ state })

  return {
    page,
    reload,
    beforeEnter,
    set loading(value: boolean) {
      state.loading = value
    },
    get loading() {
      return state.loading
    },
    set status(value: ResultStatusType | undefined) {
      state.status = value
    },
    get status() {
      return state.status
    }
  }
}
