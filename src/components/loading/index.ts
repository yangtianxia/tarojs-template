import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Loading, { type LoadingProps } from './Loading'

import './index.less'

export const Loading = withInstall(_Loading)
export default Loading

declare global {
  namespace JSX {
    interface IntrinsicElements {
      't-loading': JSXShim<LoadingProps>
    }
  }
}

export {}
