import type { App } from 'vue'
import { withInstall } from '../utils/with-install'
import _Popup, { Content as _Content, Footer as _Footer } from './Popup'

import './index.less'

export const PopupContent = withInstall(_Content)
export const PopupFooter = withInstall(_Footer)
export const Popup = withInstall(_Popup, {
  Content: PopupContent,
  Footer: PopupFooter
})

const popupInstall = Popup.install

Popup.install = (app: App) => {
  PopupContent.install(app)
  PopupFooter.install(app)
  popupInstall(app)
}

export default Popup

export { popupProps, POPUP_KEY } from './Popup'
export type { PopupProps } from './Popup'

export * from './types'
export * from './utils'
