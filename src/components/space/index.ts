import { withInstall } from '../utils/with-install'
import _Space from './Space'

import './index.less'

export const Space = withInstall(_Space)
export default Space

export { spaceProps } from './Space'
export type { SpaceProps } from './Space'
export * from './types'
