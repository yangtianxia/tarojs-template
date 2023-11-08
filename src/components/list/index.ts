import type { ComponentPublicInstance } from 'vue'
import { withInstall } from '../utils/with-install'
import _List, { ListProps, ListProvide } from './List'

import './index.less'

export const List = withInstall(_List)
export default List

export type ListInstance = ComponentPublicInstance<ListProps, ListProvide>

export type { ListProps } from './List'
