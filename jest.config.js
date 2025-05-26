module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^@api(.*)$': '<rootDir>/src/utils/burger-api.ts$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@hooks(.*)$': '<rootDir>/src/hooks$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@selectors(.*)$': '<rootDir>/src/services/selectors$1',
    '^@slices(.*)$': '<rootDir>/src/slices$1',
    '^@store(.*)$': '<rootDir>/src/services/store.ts$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@ui-pages(.*)$': '<rootDir>/src/components/ui/pages$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
