module.exports = {
  root: true,
  extends: ['../../.eslintrc.js'],
  rules: {
    // Allow console statements in examples
    'no-console': 'off',
  },
  overrides: [
    {
      // Allow any types in Storybook story files
      files: ['**/*.stories.tsx', '**/*.stories.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
