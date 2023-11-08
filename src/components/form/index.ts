import type { App } from 'vue'
import { withInstall } from '../utils/with-install'
import _Form from './Form'
import _Field from './Field'

import './index.less'

export const Field = withInstall(_Field)
export const Form = withInstall(_Form, { Field })

const formInstall = Form.install

Form.install = (app: App) => {
  Field.install(app)
  formInstall(app)
}

export default Form

export * from './types'
export type { FieldProps } from './Field'
export type { FormProps } from './Form'
