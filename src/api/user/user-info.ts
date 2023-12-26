import type { UserState } from '@/store/modules/user/types'

export function getUserInfo() {
  return request.get<UserState>('/user/info')
}
