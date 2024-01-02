import { Events } from '@tarojs/taro'
import { onUnmounted } from 'vue'

type EventName = string | symbol

class Emitter extends Events {
  von(eventName: EventName, listener: UnknownCallback) {
    const on = this.on(eventName, listener)
    onUnmounted(() => this.off(eventName))
    return on
  }

  vonce(eventName: EventName, listener: UnknownCallback) {
    const once = this.once(eventName, listener)
    onUnmounted(() => this.off(eventName))
    return once
  }
}

export { Emitter }
export default new Emitter()
