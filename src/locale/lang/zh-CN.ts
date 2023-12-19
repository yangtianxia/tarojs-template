export default {
  // Hooks
  'hooks.auth.permission.title': '权限申请',
  'hooks.auth.permission.content': (input: string) => `需要使用${input}权限，请前往设置打开权限`,
  'hooks.current.page.error': '访问异常，请重新试试！',
  // Result
  'result.404.title': '页面接口不存在或已删除',
  'result.500.title': '抱歉，服务请求异常',
  'result.nodata.title': '暂无数据',
  'result.network.title': '网络异常，请检查设备网络连接',
  'result.error.title': '抱歉，访问发生错误',
  'result.500.desc': '别紧张，试试看刷新页面'
}
