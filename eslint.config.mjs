import path from 'path';
import { fileURLToPath } from 'url';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  js.configs.recommended,
  ...nextVitals,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    plugins: {
      import: importPlugin,
      unicorn
    },
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        STATIC_CMS_CORE_VERSION: 'readonly',
        CMS_ENV: 'readonly'
      }
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      },
      'import/core-modules': ['src']
    },
    rules: {
      'no-console': [0],
      'import/no-named-as-default': 0,
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index'], ['type']]
        }
      ],
      'no-duplicate-imports': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-const': [
        'error',
        {
          destructuring: 'all'
        }
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'react/prop-types': [0],
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 0,
      'require-atomic-updates': [0],
      'unicorn/prefer-string-slice': 'error'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      'import/no-named-as-default-member': 'off',
      'no-redeclare': 'off',
      'no-undef': 'off',
      'no-duplicate-imports': [0],
      'no-implied-eval': 'off',
      'no-restricted-imports': 'off',
      'no-unused-vars': 'off',
      'require-await': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': [0],
      '@typescript-eslint/explicit-module-boundary-types': [0],
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-non-null-assertion': [0],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/*/*/*', '!@mui/material/test-utils/*'],
              message: 'Do not import material imports as 3rd level imports',
              allowTypeImports: true
            },
            {
              group: ['@mui/material', '!@mui/material/'],
              message: 'Please import material imports as defaults or 2nd level imports',
              allowTypeImports: true
            }
          ]
        }
      ],
      '@typescript-eslint/no-restricted-types': [0],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/unbound-method': 'error'
    }
  },
  {
    files: ['website/**/*'],
    rules: {
      'import/no-unresolved': [0]
    }
  },
  globalIgnores(['next-env.d.ts', 'public/sw.js', 'public/workbox-*.js', 'src/util/pdf/**', 'next.config.js'])
]);
