import type { ElementAttrs, TransformReact2VueType, StandardProps, ITouchEvent } from '@tarojs/components/types/index.vue3'
import type { AppProps, BodyProps } from '../src/components/app'
import type { SafeAreaProps } from '../src/components/safe-area'
import type { NavigationBarProps } from '../src/components/navigation-bar'
import type { ButtonProps } from '../src/components/button'
import type { SpaceProps } from '../src/components/space'
import type { CellProps, CellGroupProps } from '../src/components/cell'
import type { IconProps } from '../src/components/icon'

type Shim<T = Record<string, any>> = ElementAttrs<TransformReact2VueType<Partial<T> & StandardProps>> & {
  onTap?: Callback<ITouchEvent>
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gmApp: Shim<AppProps>,
      'gm-app': Shim<AppProps>,
      gmBody: Shim<BodyProps>,
      'gm-body': Shim<BodyProps>,
      gmSafeArea: Shim<SafeAreaProps>,
      'gm-safe-area': Shim<SafeAreaProps>,
      gmNavigationBar: Shim<NavigationBarProps>,
      'gm-navigation-bar': Shim<NavigationBarProps>,
      gmButton: Shim<ButtonProps>,
      'gm-button': Shim<ButtonProps>,
      gmSpace: Shim<SpaceProps>,
      'gm-space': Shim<SpaceProps>,
      gmCell: Shim<CellProps>,
      'gm-cell': Shim<CellProps>,
      gmCellGroup: Shim<CellGroupProps>,
      'gm-cell-group': Shim<CellGroupProps>,
      gmIcon: Shim<IconProps>,
      'gm-icon': Shim<IconProps>
    }
  }
}

export {}
