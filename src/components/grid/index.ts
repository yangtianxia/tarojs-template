import type { App } from 'vue'
import { withInstall } from '../utils/with-install'
import _Row from './Row'
import _Col from './Col'

import './index.less'

export const Col = withInstall(_Col)
export const Row = withInstall(_Row, { Col })

const rowInstall = Row.install

Row.install = (app: App) => {
  Col.install(app)
  rowInstall(app)
}

export default Row

export type { ColProps } from './Col'
export type { RowProps } from './Row'
