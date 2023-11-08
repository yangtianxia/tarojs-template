import { inject, watch } from 'vue'
import { APP_KEY } from '../app/App'

export const onAppLoaded = (callback: Callback) => {
  const app = inject(APP_KEY)

  if (app) {
    watch(
      () => app.loading.value,
      (value) => {
        callback(value)
      }
    )
  }
}
