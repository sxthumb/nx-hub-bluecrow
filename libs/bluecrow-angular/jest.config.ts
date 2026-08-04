import type { Config } from 'jest';

const config: Config = {
  displayName: 'bluecrow-angular',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/bluecrow-angular',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.bench.ts'],
  testMatch: ['**/ui-broker.spec.ts', '**/helpers.spec.ts', '**/command.decorators.spec.ts'],
};

export default config;
