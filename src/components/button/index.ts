import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Button, { type ButtonProps } from './Button'

import './index.less'

export const Button = withInstall(_Button)
export default Button

export * from './types'
export * from './utils'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      't-button': JSXShim<ButtonProps>
    }
  }
}

export {}
