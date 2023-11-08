import { withInstall } from '../utils/with-install'
import _Button from './Button'

import './index.less'

export const Button = withInstall(_Button)
export default Button

export type { ButtonProps } from './Button'
export * from './types'
export * from './utils'
