import security from 'eslint-plugin-security';

export default [
  {
    plugins: { security },
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
