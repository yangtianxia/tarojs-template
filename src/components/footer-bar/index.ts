import { withInstall } from '../utils/with-install'
import _FooterBar from './FooterBar'

import './index.less'

export const FooterBar = withInstall(_FooterBar)
export default FooterBar

export type { FooterBarProps } from './FooterBar'
