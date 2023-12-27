import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _App, { type AppProps } from './App'

import './index.less'

export const App = withInstall(_App)
export default App

declare global {
  namespace JSX {
    interface IntrinsicElements {
      't-app': JSXShim<AppProps>
    }
  }
}

export {}
