import type { ComponentPublicInstance } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _NavBar, { type NavBarProps, type NavBarProvide } from './NavBar'

import './index.less'

export const NavBar = withInstall(_NavBar)
export default NavBar

export type NavBarInstance = ComponentPublicInstance<NavBarProvide, NavBarProps>

export type { NavBarProps, NavBarProvide, NavBarConfig } from './NavBar'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      't-nav-bar': JSXShim<NavBarProps>
    }
  }
}

export {}
