import type { ResultStatusType, ResultOption } from '@/components/result'
import { useChildren } from '@/components/composables/children'
import { createInjectionKey } from '@/components/utils'

import { reactive } from 'vue'
import { isString } from '@txjs/bool'

interface UseAppOption {
  loading?: boolean
  status?: ResultStatusType
}

export interface UseAppProvide {
  state: {
    loading: boolean
    status?: ResultStatusType
  }
  loading: boolean
  status?: ResultStatusType
  reload?(error: any, callback?: Callback): void
}

export const USE_APP_KEY = createInjectionKey<UseAppProvide>('use-app')

export const useApp = (options?: UseAppOption) => {
  const { linkChildren } = useChildren(USE_APP_KEY)

  const state = reactive({
    loading: options?.loading ?? true,
    status: options?.status
  })

  const reload = (error: any, callback?: Callback) => {
    if (error.code === 401) return

    let result = { status: error } as ResultOption
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

  const result = {
    state,
    reload,
    set loading(value: boolean) {
      state.loading = value
    },
    set status(value: ResultStatusType | undefined) {
      state.status = value
    }
  }

  linkChildren(result)

  return result
}
