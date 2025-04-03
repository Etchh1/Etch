module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '/EtchMobileNew/',
    '/EtchMobileNew2/',
    '/EtchMobileNew3/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  modulePathIgnorePatterns: [
    '<rootDir>/EtchMobileNew',
    '<rootDir>/EtchMobileNew2',
    '<rootDir>/EtchMobileNew3',
  ],
}; 