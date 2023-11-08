import { withInstall } from '../utils/with-install'
import _SafeArea from './SafeArea'

import './index.less'

export const SafeArea = withInstall(_SafeArea)
export default SafeArea

export type { SafeAreaProps } from './SafeArea'
