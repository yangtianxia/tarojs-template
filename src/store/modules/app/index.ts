import { defineStore } from 'pinia'
import type { AppState } from './types'

const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    apiCategory: 'default',
    scene: 0,
    path: ''
  }),

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
