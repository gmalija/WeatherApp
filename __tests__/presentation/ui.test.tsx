import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent } from '@testing-library/react-native';

import { weatherReducer } from '../../src/presentation/state/weatherSlice';
import { FakeSearchInput } from '../../src/presentation/components/FakeSearchInput';
import { ProviderToggleIcon } from '../../src/presentation/components/ProviderToggleIcon';
import { HomeScreen } from '../../src/presentation/screens/HomeScreen/HomeScreen';
import { LocationSearchScreen } from '../../src/presentation/screens/LocationSearchScreen/LocationSearchScreen';
import { WeatherProviderIds } from '../../src/domain/valueObjects/WeatherProviderId';
import type { WeatherForecast } from '../../src/domain/entities/WeatherForecast';

jest.mock('../../src/application/weatherDependencies', () => {
  const mockForecast: WeatherForecast = {
    location: {
      latitude: 1,
      longitude: 2,
      name: 'Mock city',
    },
    providerId: 'OPEN_METEO' as any,
    current: {
      time: new Date('2026-01-16T12:00:00Z'),
      temperature: 10,
      windSpeed: 5,
      precipitation: 0,
      weatherCode: 1,
    },
    daily: [],
  };

  return {
    weatherDependencies: {
      geocodingService: {
        searchLocationsByName: jest.fn().mockResolvedValue([
          {
            latitude: 37.61,
            longitude: -0.99,
            name: 'Cartagena, España',
          },
          {
            latitude: 10.39,
            longitude: -75.48,
            name: 'Cartagena, Colombia',
          },
        ]),
      },
      getWeatherByLocationUseCase: {
        execute: jest.fn().mockResolvedValue(mockForecast),
      },
      getWeatherForCurrentLocationUseCase: {
        execute: jest.fn().mockResolvedValue(mockForecast),
      },
    },
  };
});

function createTestStore(preloaded?: Partial<ReturnType<typeof weatherReducer>>) {
  return configureStore({
    reducer: {
      weather: weatherReducer,
    },
    preloadedState: preloaded
      ? {
          weather: {
            selectedProviderId: WeatherProviderIds.OPEN_METEO,
            currentLocation: null,
            currentForecast: null,
            status: 'idle',
            error: null,
            ...preloaded,
          },
        }
      : undefined,
  });
}

function wrapWithStoreAndNav(ui: React.ReactElement, preloaded?: Partial<ReturnType<typeof weatherReducer>>) {
  const store = createTestStore(preloaded);

  return {
    store,
    ...render(
      <Provider store={store}>
        <NavigationContainer>{ui}</NavigationContainer>
      </Provider>,
    ),
  };
}

describe('FakeSearchInput', () => {
  it('shows placeholder when there is no current location', () => {
    const { getByText } = wrapWithStoreAndNav(<FakeSearchInput />);

    expect(getByText('Search location')).toBeTruthy();
  });
});

describe('ProviderToggleIcon', () => {
  it('toggles provider in store when pressed', () => {
    const { getByText, store } = wrapWithStoreAndNav(<ProviderToggleIcon />);

    const button = getByText('Open-Meteo');

    fireEvent.press(button);

    const state = store.getState().weather;
    expect(state.selectedProviderId).toBe(WeatherProviderIds.METEOBLUE);
  });
});

describe('HomeScreen', () => {
  it('renders summary when forecast is present', () => {
    const mockForecast: WeatherForecast = {
      location: {
        latitude: 1,
        longitude: 2,
        name: 'Home city',
      },
      providerId: WeatherProviderIds.OPEN_METEO,
      current: {
        time: new Date('2026-01-16T12:00:00Z'),
        temperature: 12,
        windSpeed: 4,
        precipitation: 0,
        weatherCode: 1,
      },
      daily: [],
    };

    const { getByText } = wrapWithStoreAndNav(<HomeScreen />, {
      currentForecast: mockForecast,
    } as any);

    expect(getByText('Home city')).toBeTruthy();
  });
});

describe('LocationSearchScreen', () => {
  it('shows error when input is empty', () => {
    const { getByText, getByPlaceholderText } = wrapWithStoreAndNav(<LocationSearchScreen />);

    const input = getByPlaceholderText('Madrid, España');
    fireEvent.changeText(input, '   ');

    const button = getByText('Search');
    fireEvent.press(button);

    expect(getByText('Location is required')).toBeTruthy();
  });

  it('shows suggestions when searching and multiple locations are returned', async () => {
    const { getByPlaceholderText, getByText, findByText } = wrapWithStoreAndNav(<LocationSearchScreen />);

    const input = getByPlaceholderText('Madrid, España');
    fireEvent.changeText(input, 'Cart');

    const button = getByText('Search');
    fireEvent.press(button);

    await findByText('Select a location');
    await findByText('Cartagena, España');
  });
});
