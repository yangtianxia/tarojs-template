import { Events as TaroEvents } from '@tarojs/taro'
import { onUnmounted } from 'vue'

class Events extends TaroEvents {
  von(eventName: string, listener: Callback) {
    const $on = this.on(eventName, listener)
    onUnmounted(() => this.off(eventName))
    return $on
  }

  vonce(eventName: string, listener: Callback) {
    const $once = this.once(eventName, listener)
    onUnmounted(() => this.off(eventName))
    return $once
  }
}

export const useEvent = new Events()

export default Events
