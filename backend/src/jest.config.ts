import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.spec.ts', '**/testFunctions.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  
  },
};

export default config;