import type { App } from 'vue'
import { withInstall } from '../utils/with-install'
import _Cell from './Cell'
import _Group from './Group'

import './index.less'

export const CellGroup = withInstall(_Group)
export const Cell = withInstall(_Cell, { Group: CellGroup })

const cellInstall = Cell.install

Cell.install = (app: App) => {
  CellGroup.install(app)
  cellInstall(app)
}

export default Cell

export { cellSharedProps } from './utils'
export type { CellProps } from './Cell'
export type { CellGroupProps } from './Group'
