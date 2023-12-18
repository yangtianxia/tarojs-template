import { isFunction } from '@txjs/bool'
import Locale from '@/locale'

function createTranslate(key: string, ...args: unknown[]) {
  const messages = Locale.messages()
  const message = messages[key]
  return isFunction(message) ? message(...args) : message
}

export default createTranslate
