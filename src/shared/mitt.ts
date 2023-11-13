import { Events } from '@tarojs/taro'
import { onUnmounted } from 'vue'

class Mitt extends Events {
  subscribe(eventName: string, listener: Callback) {
    const on = this.on(eventName, listener)
    onUnmounted(() => this.off(eventName))
    return on
  }

  subscribeOnce(eventName: string, listener: Callback) {
    const once = this.once(eventName, listener)
    onUnmounted(() => this.off(eventName))
    return once
  }
}

export default new Mitt()
