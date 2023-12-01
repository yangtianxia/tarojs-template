import { inject, watch } from 'vue'
import { createInjectionKey } from '../utils'

export const APP_LOADING_KEY = createInjectionKey<() => boolean>('app-loading')

export const onAppLoaded = (callback: Callback<boolean>) => {
  const appLoading = inject(APP_LOADING_KEY, null)

  if (appLoading) {
    watch(appLoading, (loading) => {
      callback(loading)
    })
  }
}
