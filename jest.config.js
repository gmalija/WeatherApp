module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-native-screens|react-redux|@reduxjs/toolkit|immer)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/helpers/',
  ],
};
