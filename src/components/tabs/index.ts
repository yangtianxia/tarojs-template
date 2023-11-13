import type { App } from 'vue'
import { withInstall } from '../utils/with-install'
import _Tabs from './Tabs'
import _Tab from './Tab'

import './index.less'

export const Tab = withInstall(_Tab)
export const Tabs = withInstall(_Tabs, { Item: Tab })

const tabInstall = Tab.install

Tab.install = (app: App) => {
  Tab.install(app)
  tabInstall(app)
}

export default Tab

export type { TabsProps } from './Tabs'
export type { TabProps } from './Tab'
