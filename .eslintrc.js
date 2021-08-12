module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': 'off',
    'prettier/prettier': ['error', { singleQuote: true, printWidth: 120 }],
  },
};
