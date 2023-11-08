import { withInstall } from '../utils/with-install'
import _CountDown from './CountDown'

import './index.less'

export const CountDown = withInstall(_CountDown)
export default CountDown

export { countDownProps } from './CountDown'
export type { CountDownProps } from './CountDown'
export type { CountDownInstance, CountDownCurrentTime } from './types'
