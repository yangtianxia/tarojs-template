import { getCurrentInstance } from 'vue'
import { shallowMerge } from '@txjs/shared'

export const useExpose = <T extends Record<string, any>>(apis: T) => {
  const instance = getCurrentInstance()

  if (instance) {
    shallowMerge(instance.proxy!, apis)
  }
}
