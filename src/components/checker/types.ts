export type CheckerShape = 'square' | 'round'

export type CheckerDirection = 'horizontal' | 'vertical'

export type CheckerLabelPosition = 'left' | 'right'

export type CheckerParent = {
  props: {
    disabled?: boolean
    iconSize?: Numeric
    direction?: CheckerDirection
    checkedColor?: string
  }
}
