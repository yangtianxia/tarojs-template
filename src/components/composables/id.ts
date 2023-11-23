import { getCurrentInstance } from 'vue'

let current = 0

export const useId = () => {
  const vm = getCurrentInstance()
  const { name = 'unknown' } = vm?.type || {}
  return `${name}-${++current}`
}
