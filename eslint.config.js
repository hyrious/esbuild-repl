// @ts-check
import eslint from '@eslint/js'
import tse from 'typescript-eslint'

export default tse.config({
  extends: [eslint.configs.recommended, ...tse.configs.recommended],
  files: ['**/*.ts'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/ban-types': ['error', { types: { '{}': false }, extendDefaults: true }],
    'no-constant-condition': 'off',
  },
})
