import security from 'eslint-plugin-security';
import globals from 'globals';

export default [
  // Base config — browser app files
  {
    files: ['app.js'],
    plugins: { security },
    languageOptions: {
      globals: {
        ...globals.browser,
        CONFESSIONS: 'readonly',
        calculateWeight: 'readonly',
        getJudgment: 'readonly',
        setPlea: 'readonly',
        resetConfessions: 'readonly',
      },
    },
    rules: {
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-require': 'error',
      'security/detect-object-injection': 'warn',
      'no-eval': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },

  // logic.js — Node module (exported for testing)
  {
    files: ['logic.js'],
    plugins: { security },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-require': 'error',
      'security/detect-object-injection': 'warn',
      'no-eval': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },

  // logic.test.js — Jest test file
  {
    files: ['logic.test.js'],
    plugins: { security },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-require': 'error',
      'security/detect-object-injection': 'warn',
      'no-eval': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },

  { ignores: ['node_modules/**'] },
];
