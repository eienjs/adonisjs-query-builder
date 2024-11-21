// @ts-check
import nodecfdiConfig from '@nodecfdi/eslint-config';

const { defineConfig } = nodecfdiConfig(import.meta.dirname, { adonisjs: true, sonarjs: true, n: true });

export default defineConfig(
  {
    files: ['src/providers/**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    rules: {
      'no-param-reassign': 'off',
    },
  },
);
