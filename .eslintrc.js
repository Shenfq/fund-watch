module.exports = {
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js', '.json'],
      },
    },
    'import/extensions': ['.ts', '.js'],
    'import/ignore': [
      'vscode',
      'node_modules',
      '\\.(coffee|scss|css|less|hbs|svg|json)$',
    ],
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': [
      2,
      {
        ignore: ['vscode'],
      },
    ],
    'no-irregular-whitespace': 'off',
    // 使用 ts 的 unused-vars
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
