import '@tarojs/taro'

declare module '@tarojs/taro' {
  interface AuthSetting {
    /** 模糊地理位置，对应接口 [Taro.getFuzzyLocation] */
    'scope.userFuzzyLocation'?: boolean
    /** 蓝牙，对应接口 [Taro.openBluetoothAdapter, Taro.createBLEPeripheralServer] */
    'scope.bluetooth'?: boolean
    /** 后台定位，对应接口 [Taro.startLocationUpdateBackground] */
    'scope.userLocationBackground'?: boolean
    /** 添加到联系人，对应接口 [Taro.addPhoneContact] */
    'scope.addPhoneContact'?: boolean
    /** 添加到日历，对应接口 [Taro.addPhoneRepeatCalendar, Taro.addPhoneCalendar] */
    'scope.addPhoneCalendar'?: boolean
  }
}
