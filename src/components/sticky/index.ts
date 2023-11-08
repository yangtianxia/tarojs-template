import { withInstall } from '../utils/with-install'
import _Sticky from './Sticky'

import './index.less'

export const Sticky = withInstall(_Sticky)
export default Sticky

export { stickyProps } from './Sticky'
export type { StickyScrollOptions, StickyProps } from './Sticky'
