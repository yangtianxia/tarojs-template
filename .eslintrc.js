module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'taro/vue3'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: '2020',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'no-undef': 'off',
    'camelcase': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'warn',
    'eol-last': 'error',
    'quote-props': 'off',
    'space-before-function-paren': 'off',
    'no-unused-expressions': 'error',
    'node/no-callback-literal': 'off',
    'multiline-ternary': 'off',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'error'
  },
  globals: {
    wx: true,
    my: true,
    $t: true,
    BEM: true,
    emitter: true,
    toast: true,
    modal: true,
    request: true,
    router: true
  }
}
