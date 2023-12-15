import type { getEnterOptionsSync } from '@tarojs/taro'

export type EnterOptions = ReturnType<typeof getEnterOptionsSync>

export type EnterOptionsKey = 'apiCategory' | 'scene' | 'path'

export type ThemeType = {
  theme: 'light' | 'dark'
}

export type AppState = ThemeType
  & Pick<EnterOptions, EnterOptionsKey>
  & Optional<Omit<EnterOptions, EnterOptionsKey>>
