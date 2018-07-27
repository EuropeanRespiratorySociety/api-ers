module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  extends: [
    'prettier'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',

    'prettier/prettier': [
      'error',
      {
        singleQuote: false
      }
    ],
    'vue/html-quotes': [
      'error',
      'double'
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
}