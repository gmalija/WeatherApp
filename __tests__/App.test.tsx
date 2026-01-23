/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// Mock geolocation
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
}));

// Mock weather dependencies
jest.mock('../src/application/weatherDependencies', () => ({
  weatherDependencies: {
    geocodingService: {
      searchLocationsByName: jest.fn().mockResolvedValue([]),
      searchFirstLocationByName: jest.fn().mockResolvedValue(null),
    },
    getWeatherByLocationUseCase: {
      execute: jest.fn().mockResolvedValue({
        location: {latitude: 0, longitude: 0, name: 'Test'},
        providerId: 'OPEN_METEO',
        current: {
          time: new Date(),
          temperature: 20,
          windSpeed: 10,
          precipitation: 0,
          weatherCode: 1,
        },
        daily: [],
      }),
    },
    getWeatherForCurrentLocationUseCase: {
      execute: jest.fn().mockResolvedValue({
        location: {latitude: 0, longitude: 0, name: 'Test'},
        providerId: 'OPEN_METEO',
        current: {
          time: new Date(),
          temperature: 20,
          windSpeed: 10,
          precipitation: 0,
          weatherCode: 1,
        },
        daily: [],
      }),
    },
  },
}));

describe('App', () => {
  it('renders correctly', async () => {
    await ReactTestRenderer.act(async () => {
      const tree = ReactTestRenderer.create(<App />);
      expect(tree).toBeDefined();
    });
  });

  it('initializes with all required providers', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<App />);
    });

    // Verify app renders without crashing
    expect(tree).toBeDefined();
    expect(tree?.toJSON()).toBeTruthy();
  });
});
