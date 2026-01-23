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
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
