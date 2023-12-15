module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'taro/vue3',
    'eslint-config-airbnb'
  ],
  parserOptions: {
    ecmaVersion: '2020',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    // 要求变量名和函数名必须使用驼峰命名法
    'camelcase': 'error',
    // 要求未使用的变量必须被删除
    'no-unused-vars': 'warn',
    // 禁止使用 console 进行日志记录
    'no-console': 'off',
    // 禁止使用 debugger 语句
    'no-debugger': 'warn',
    // 要求文件必须以换行符结尾
    'eol-last': 'error',
    // 要求对象属性的值必须使用双引号或单引号括起来
    'quote-props': 'error',
    // 要求函数括号之前必须有一个空格
    'space-before-function-paren': 'error',
    // 要求未使用的表达式必须被删除
    'no-unused-expressions': 'error',
    // 禁止使用内联回调函数
    'node/no-callback-literal': 'off',
    // 禁止使用多行三元运算符
    'multiline-ternary': 'off',
    // 禁止使用 require 来导入模块
    '@typescript-eslint/no-var-requires': 'error',
    // 禁止使用空函数
    '@typescript-eslint/no-empty-function': 'off',
    // 禁止使用 any 类型
    '@typescript-eslint/no-explicit-any': 'off',
    // 禁止使用 ! 来断言变量不为 null 或 undefined
    '@typescript-eslint/no-non-null-assertion': 'off',
    // 要求导出和导入的类型必须一致
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    // 检查注释是否符合规范
    'comment-format': [
      'error',
      {
        'line-length': 100,
        'require-header': true,
        'header-max-length': 50,
        'header-pattern': '/ * @author Tianxia Yang * /'
      }
    ]
  }
}
