import { withInstall } from '../utils/with-install'
import _Result from './Result'

import './index.less'

export const Result = withInstall(_Result)
export default Result

export { resultSharedProps } from './utils'
export type { ResultProps } from './Result'
export * from './types'
