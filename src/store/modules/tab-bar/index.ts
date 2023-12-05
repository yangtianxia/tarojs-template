import type { TabBarItem } from '@tarojs/taro'
import { defineStore } from 'pinia'

const useTabbarStore = defineStore('tabbar', {
  state: () => ({
    height: 0,
    tabbar: [] as TabBarItem[],
    currentPath: ''
  }),

  getters: {
    currentIndex: (state) => {
      return Math.max(
        state.tabbar.findIndex(
          (item) => state.currentPath.indexOf(item.pagePath) !== -1
        ),
        0
      )
    }
  },

  actions: {
    setTabbar(items: TabBarItem[]) {
      this.tabbar = items
    },

    setHeight(value: number) {
      this.height = value
    },

    setCurrentPath(path: string) {
      const fountAt = path.indexOf('/')

      if (fountAt === 0) {
        path = path.slice(1)
      }

      this.currentPath = path
    },

    resetTabbar() {
      this.$reset()
    }
  }
})

export default useTabbarStore
