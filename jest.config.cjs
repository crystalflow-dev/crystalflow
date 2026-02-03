module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/__tests__/**/*.tsx',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).tsx',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  passWithNoTests: true,
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          noUnusedLocals: false,
          noUnusedParameters: false,
          jsx: 'react-jsx',
          module: 'esnext', // Allow import.meta usage
          moduleResolution: 'bundler',
        },
      },
    ],
  },
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    'packages/*/src/**/*.tsx',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@reactflo/core$': '<rootDir>/packages/core/src',
    '^@reactflo/types$': '<rootDir>/packages/types/src',
    '^@reactflo/react$': '<rootDir>/packages/react/src',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock cssInJs module that uses Vite-specific imports
    '^.*/styles/cssInJs$': '<rootDir>/packages/react/src/styles/__mocks__/cssInJs.ts',
    // Mock Vite-specific imports in tests
    '^@xyflow/react/dist/style\\.css\\?raw$':
      '<rootDir>/packages/react/src/styles/__mocks__/cssInJs.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
