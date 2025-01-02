import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettier,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: [
      'coverage/',
      'dist/',
      'build/',
      '**/node_modules/',
      'jest.config.js',
      'config/*',
      '**/*.d.ts',
      '**/*.js.map',
      '.env',
      '.env.*',
      '**/*.log',
      '**/*.bak',
      '**/*.tmp',
    ],
  },
];
