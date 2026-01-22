import { configureStore } from '@reduxjs/toolkit';

import { weatherReducer, fetchWeatherByLocation, fetchWeatherForCurrentLocation, setSelectedProviderId } from '../../src/presentation/state/weatherSlice';
import { WeatherProviderIds } from '../../src/domain/valueObjects/WeatherProviderId';
import type { Location } from '../../src/domain/entities/Location';
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
      getWeatherByLocationUseCase: {
        execute: jest.fn().mockResolvedValue(mockForecast),
      },
      getWeatherForCurrentLocationUseCase: {
        execute: jest.fn().mockResolvedValue(mockForecast),
      },
    },
  };
});

function createStore() {
  return configureStore({
    reducer: {
      weather: weatherReducer,
    },
  });
}

describe('weatherSlice', () => {
  it('changes selected provider', () => {
    const store = createStore();

    store.dispatch(setSelectedProviderId(WeatherProviderIds.METEOBLUE));

    const state = store.getState().weather;
    expect(state.selectedProviderId).toBe(WeatherProviderIds.METEOBLUE);
  });

  it('fetchWeatherByLocation stores forecast and location on success', async () => {
    const store = createStore();

    const location: Location = {
      latitude: 10,
      longitude: 20,
      name: 'Somewhere',
    };

    await store.dispatch(fetchWeatherByLocation({ location }));

    const state = store.getState().weather;
    expect(state.status).toBe('success');
    expect(state.currentForecast).not.toBeNull();
    expect(state.currentLocation).not.toBeNull();
  });

  it('fetchWeatherForCurrentLocation stores forecast and location on success', async () => {
    const store = createStore();

    await store.dispatch(fetchWeatherForCurrentLocation());

    const state = store.getState().weather;
    expect(state.status).toBe('success');
    expect(state.currentForecast).not.toBeNull();
    expect(state.currentLocation).not.toBeNull();
  });
});
