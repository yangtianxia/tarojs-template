import { withInstall } from '../utils/with-install'
import _RangeDatePicker from './RangeDatePicker'

import './index.less'

export const RangeDatePicker = withInstall(_RangeDatePicker)
export default RangeDatePicker

export type { DatePickerProps } from './RangeDatePicker'
export { isInvalidDate, isEarlierDate } from './utils'
