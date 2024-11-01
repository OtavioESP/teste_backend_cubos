module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1'
    }
  };
  