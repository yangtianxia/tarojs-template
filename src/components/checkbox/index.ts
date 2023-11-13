import type { App } from 'vue'
import { withInstall } from '../utils/with-install'
import _Checkbox from './Checkbox'
import _Group from './Group'

import './icon.less'
import './index.less'

export const CheckboxGroup = withInstall(_Group)
export const Checkbox = withInstall(_Checkbox, { Group: CheckboxGroup })

const checkboxInstall = Checkbox.install

Checkbox.install = (app: App) => {
  CheckboxGroup.install(app)
  checkboxInstall(app)
}

export default Checkbox

export { checkboxGroupProps } from './Group'
export { checkboxProps } from './Checkbox'

export type { CheckboxProps } from './Checkbox'
export type { CheckboxGroupProps } from './Group'

export type {
 CheckboxShape,
 CheckboxInstance,
 CheckboxLabelPosition,
 CheckboxGroupDirection,
 CheckboxGroupToggleAllOptions,
 CheckboxGroupInstance
} from './types'
