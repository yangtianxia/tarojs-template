import type { ComponentPublicInstance } from 'vue'
import { withInstall } from '../utils/with-install'
import _NavigationBar, { type NavigationBarProps, type NavigationBarProvide } from './NavigationBar'

import './index.less'

export const NavigationBar = withInstall(_NavigationBar)
export default NavigationBar

export type NavigationBarInstance = ComponentPublicInstance<NavigationBarProvide, NavigationBarProps>

export type {
  NavigationBarProps,
  NavigationBarProvide,
  NavigationBarConfig
} from './NavigationBar'
