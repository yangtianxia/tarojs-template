import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Result, { ResultProps } from './Result'

import './index.less'

export const Result = withInstall(_Result)
export default Result

export * from './types'
export { resultSharedProps } from './utils'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      't-result': JSXShim<ResultProps>
    }
  }
}

export {}
