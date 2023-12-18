import extend from 'extend'
import { ref, reactive } from 'vue'
import defaultMessages from './lang/zh-CN'

type Message = Record<string, any>
type Messages = Record<string, Message>

const lang = ref('zh-CN')
const messages = reactive<Messages>({
  'zh-CN': defaultMessages
})

export const Locale = {
  messages(): Message {
    return messages[lang.value]
  },

  use(newLang: string, newMessages?: Message) {
    lang.value = newLang
    this.add({ [lang.value]: newMessages })
  },

  add(newMessages: Message = {}) {
    extend(true, messages, newMessages)
  }
}

export const useCurrentLang = () => lang

export default Locale
