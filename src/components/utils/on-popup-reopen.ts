import { inject, watch } from 'vue'
import { createInjectionKey } from '../utils'

export const POPUP_TOGGLE_KEY = createInjectionKey<() => boolean>('popup-toggle')

export const onPopupReopen = (callback: Callback) => {
  const popupToggleStatus = inject(POPUP_TOGGLE_KEY, null)

  if (popupToggleStatus) {
    watch(popupToggleStatus, (show) => {
      if (show) {
        callback()
      }
    })
  }
}
