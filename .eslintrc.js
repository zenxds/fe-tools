module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: [
    "react",
    '@typescript-eslint'
  ],
  globals: {
    nodeRequire: true,
    API_SERVER_PLACEHOLDER: true,
    __webpack_public_path__: true,
  },
  rules: {
    '@typescript-eslint/indent': ['warn', 2],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
}
