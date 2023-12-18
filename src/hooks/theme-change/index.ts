import { canIUse, onThemeChange } from '@tarojs/taro'

type ThemeChangeCallback = Parameters<typeof onThemeChange>[0]

export const useThemeChange = (callback: ThemeChangeCallback) => {
  if (canIUse('onThemeChange')) {
    onThemeChange(callback)
  }
}
