import type { UserState } from '@/store/modules/user/types'
import { request } from '../with-request'

export function getUserInfo() {
  return request.get<UserState>('/user/info')
}
