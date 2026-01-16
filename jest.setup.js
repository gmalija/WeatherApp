jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));
