module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'jest'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:jest/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'variableLike', format: ['camelCase', 'UPPER_CASE'] },
      { selector: 'property', format: ['camelCase'] },
      { selector: 'class', format: ['PascalCase'] },
      { selector: 'classMethod', format: ['camelCase'] },
      { selector: 'objectLiteralMethod', format: ['camelCase'] },
      {
        // object literal proptery 에 다양한 케이스 허용
        // 사용 예: env, open api, DB Key
        selector: 'objectLiteralProperty',
        format: ['camelCase', 'UPPER_CASE', 'snake_case'],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }], // 함수의 반환 타입 명시
    '@typescript-eslint/no-explicit-any': 'error', // any 사용시 경고
    'import/order': [
      // import 순서 정렬
      'warn',
      {
        alphabetize: {
          order: 'asc', // 알파벳 순서로 정렬
        },
        'newlines-between': 'always', // 그룹 별 newline 으로 구분
        // 기본 ["builtin", "external", "parent", "sibling", "index"] 순서로, 변경 가능
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.constants.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
          },
        ],
      },
    },
    {
      files: ['**/*.decorator.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase'],
          },
        ],
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};
