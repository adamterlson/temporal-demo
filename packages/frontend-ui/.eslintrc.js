module.exports = {
  extends: ['react-app', 'react-app/jest'],
  plugins: ['jest'],
  env: {
    'jest': true,
    'jest/globals': true // Disable the problematic environment
  },
  overrides: [
    {
      files: ['**/*.js?(x)', '**/*.ts?(x)'],
      env: {
        'jest': true
      }
    }
  ]
};
