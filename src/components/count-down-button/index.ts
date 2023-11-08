import { withInstall } from '../utils/with-install'
import _CountDownButton from './CountDownButton'

import './index.less'

export const CountDownButton = withInstall(_CountDownButton)
export default CountDownButton

export type { CountDownButtonProps } from './CountDownButton'
