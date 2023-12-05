import { createPinia } from 'pinia'
import useAppStore from './modules/app'
import useUserStore from './modules/user'
import useTabbarStore from './modules/tab-bar'

const pinia = createPinia()

export { useAppStore, useUserStore, useTabbarStore }
export default pinia
