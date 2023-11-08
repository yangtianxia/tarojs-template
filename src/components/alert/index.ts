import { withInstall } from '../utils/with-install'
import _Alert from './Alert'

import './index.less'

export const Alert = withInstall(_Alert)
export default Alert

export type { AlertProps } from './Alert'
