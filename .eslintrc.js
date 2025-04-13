module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jsdoc/recommended-typescript-error',
    'plugin:sonarjs/recommended',
  ],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        endOfLine: 'auto',
      },
    ],
    'no-underscore/no-underscore': [
      'error',
      {
        allowConstants: true,
        allowLeadingUnderscores: false,
      },
    ],
  },
  plugins: ['@typescript-eslint', 'prettier', 'no-underscore'],
};
