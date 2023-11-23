import { getCurrentInstance } from 'vue'
import { shallowMerge } from '@txjs/shared'

export const useExpose = <T = Record<string, any>>(apis: T) => {
  const instance = getCurrentInstance()

  if (instance) {
    shallowMerge(instance.proxy!, apis)
  }
}
