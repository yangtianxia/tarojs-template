// copy vant-weapp
import extend from 'extend'
import { getCurrentInstance } from 'vue'

export const useExpose = <T = Record<string, any>>(apis: T) => {
  const instance = getCurrentInstance()

  if (instance) {
    extend(instance.proxy!, apis)
  }
}
