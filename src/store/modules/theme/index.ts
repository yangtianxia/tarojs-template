import { defineStore } from 'pinia'
import type { ThemeType } from './types'

const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light' as ThemeType
  }),

  getters: {
    currentTheme: (state) => state.theme
  },

  actions: {
    setTheme(value: ThemeType) {
      this.theme = value
    },

    resetTheme() {
      this.$reset()
    }
  }
})

export default useThemeStore
