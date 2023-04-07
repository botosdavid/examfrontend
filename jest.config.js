const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {

  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)