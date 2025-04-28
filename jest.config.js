module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/*whitebox.test.js',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    '^redux-persist/es/(.*)$': 'redux-persist/lib/$1',
  },
  collectCoverageFrom: [
    'src/redux/**/*.js',
    '!src/redux/**/__tests__/*.js',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
  globalTeardown: '<rootDir>/jest.teardown.js',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}; 