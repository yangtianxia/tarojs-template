import type { NavBarTextStyle } from './types'

export const TEXT_STYLE = {
  white: 'white',
  black: 'black'
} as const

type TextStyleKeys = Array<keyof typeof TEXT_STYLE>

export const textStyleKeys = Object.keys(
  TEXT_STYLE
) as TextStyleKeys

export function getTextStyle(input: NavBarTextStyle) {
  const fountAt =  Math.max(textStyleKeys.indexOf(input), 0)
  return textStyleKeys[fountAt ? 0 : 1]
}
