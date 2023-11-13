import { canIUse, onThemeChange } from '@tarojs/taro'

export const useThemeChange = (...args: Parameters<typeof onThemeChange>) => {
  if (canIUse('onThemeChange')) {
    onThemeChange(...args)
  }
}
