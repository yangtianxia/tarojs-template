import { request } from '../with-request'

export function postLogout() {
  return request.post('/logout')
}
