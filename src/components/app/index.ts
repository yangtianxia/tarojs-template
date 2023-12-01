import type { App as VueApp } from 'vue'
import { withInstall } from '../utils/with-install'
import _App from './App'
import _Body from './Body'

import './index.less'

export const Body = withInstall(_Body)
export const App = withInstall(_App, { Body })

const appInstall = App.install

App.install = (app: VueApp) => {
  Body.install(app)
  appInstall(app)
}

export default App

export type { AppProps } from './App'
export type { BodyProps } from './Body'
export * from './utils'
