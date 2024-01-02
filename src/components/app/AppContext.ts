import { inject, watch } from 'vue'
import { createInjectionKey } from '../_utils/basic'

export const APP_LOADING_KEY = createInjectionKey<() => boolean>('app-loading')

export const onAppLoaded = (callback: UnknownCallback<boolean>) => {
  const loading = inject(APP_LOADING_KEY, null)

  if (loading) {
    watch(loading, (value) => callback(value))
  }
}
