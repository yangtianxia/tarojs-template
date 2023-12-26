import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Icon, { IconProps } from './Icon'

import './index.less'

export const Icon = withInstall(_Icon)
export default Icon

declare global {
  namespace JSX {
    interface IntrinsicElements {
      't-icon': JSXShim<IconProps>
    }
  }
}

export {}
