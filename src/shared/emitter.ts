import { Events } from '@tarojs/taro'
import { onUnmounted } from 'vue'

type EventName = string | symbol

class Emitter extends Events {
  monitor(eventName: EventName, listener: AnyCallback) {
    const on = this.on(eventName, listener)
    onUnmounted(() => this.off(eventName))
    return on
  }

  monitorOnce(eventName: EventName, listener: AnyCallback) {
    const once = this.once(eventName, listener)
    onUnmounted(() => this.off(eventName))
    return once
  }
}

export { Emitter }
export default new Emitter()
