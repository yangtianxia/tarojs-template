import { withInstall } from '../utils/with-install'
import _ActionSheet from './ActionSheet'

import './index.less'

export const ActionSheet = withInstall(_ActionSheet)
export default ActionSheet

export { actionSheetProps } from './ActionSheet'
export type { ActionSheetProps, ActionSheetOption } from './ActionSheet'
