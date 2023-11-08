import type { App } from 'vue'
import { withInstall } from '../utils/with-install'
import _TabItem from './Item'
import _Tab from './Tab'

import './index.less'

export const TabItem = withInstall(_TabItem)
export const Tab = withInstall(_Tab, { Item: TabItem })

const tabInstall = Tab.install

Tab.install = (app: App) => {
  TabItem.install(app)
  tabInstall(app)
}

export default Tab

export type { TabProps } from './Tab'
export type { TabItemProps } from './Item'
