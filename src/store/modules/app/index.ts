import { defineStore } from 'pinia'
import type { AppState } from './types'

const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    scene: 0,
    path: '',
    apiCategory: 'default'
  }),

  getters: {
    /** 暗黑模式 */
    isDark: (state) => {
      return state.theme === 'dark'
    },

    /** 半屏打开 */
    isEmbedded: (state) => {
      return state.apiCategory === 'embedded'
    }
  },

  actions: {
    setInfo(partial: Partial<AppState>) {
      this.$patch(partial)
    },

    resetInfo() {
      this.$reset()
    }
  }
})

export default useAppStore
