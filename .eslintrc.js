module.exports = {
  root: true,
  extends: [
    'taro/vue3'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'camelcase': 0,
    'no-unused-vars': 0,
    'no-console': 'off',
    'no-debugger': 'off',
    'eol-last': ['error', 'always'],
    'quote-props': [0, 'always'],
    'space-before-function-paren': 0,
    'no-unused-expressions': 'off',
    'node/no-callback-literal': 'off',
    'multiline-ternary': ['error', 'never'],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
  globals: {
    wx: true,
    my: true
  }
}
