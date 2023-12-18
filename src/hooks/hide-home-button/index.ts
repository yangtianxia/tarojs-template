import { canIUse, hideHomeButton } from '@tarojs/taro'

/**
 * 隐藏返回首页按钮
 * * 微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，默认展示“返回首页”按钮
 * * 开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏
 */
export const useHideHomeButton = () => {
  if (canIUse('hideHomeButton')) {
    hideHomeButton()
  } else if (process.env.TARO_ENV === 'alipay') {
    my.hideBackHome()
  }
}
