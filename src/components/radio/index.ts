import type { App } from 'vue'
import { withInstall } from '../utils/with-install'
import _Group from './Group'
import _Radio from './Radio'

import './index.less'

export const RadioGroup = withInstall(_Group)
export const Radio = withInstall(_Radio, { Group: RadioGroup })

const radioInstall = Radio.install

Radio.install = (app: App) => {
  RadioGroup.install(app)
  radioInstall(app)
}

export default Radio

export { radioGroupProps } from './Group'
export { radioProps } from './Radio'

export type { RadioGroupProps } from './Group'
export type { RadioProps, RadioShape, RadioLabelPosition } from './Radio'
