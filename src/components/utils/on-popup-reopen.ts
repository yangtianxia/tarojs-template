import { inject, watch, type InjectionKey } from 'vue'

export const POPUP_TOGGLE_KEY: InjectionKey<() => boolean> = Symbol()

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
