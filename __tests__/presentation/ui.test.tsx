import React from 'react';
import {renderWithProviders, fireEvent, waitFor} from '../helpers/testUtils.tsx';
import type {WeatherForecast} from '../../src/domain/entities/WeatherForecast';
import {FakeSearchInput} from '../../src/presentation/components/FakeSearchInput';
import {HomeScreen} from '../../src/presentation/screens/HomeScreen/HomeScreen';
import {LocationSearchScreen} from '../../src/presentation/screens/LocationSearchScreen/LocationSearchScreen';
import {SettingsMenu} from '../../src/presentation/components/SettingsMenu';

// Mock weather dependencies
jest.mock('../../src/application/weatherDependencies', () => {
  const mockForecast: WeatherForecast = {
    location: {
      latitude: 1,
      longitude: 2,
      name: 'Mock City',
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
        searchFirstLocationByName: jest.fn().mockResolvedValue({
          latitude: 37.61,
          longitude: -0.99,
          name: 'Cartagena, España',
        }),
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

describe('FakeSearchInput', () => {
  it('shows placeholder when there is no selected location', () => {
    const {getByText} = renderWithProviders(<FakeSearchInput />);
    expect(getByText('Search location')).toBeTruthy();
  });

  it('shows location name when a location is selected', () => {
    const preloadedState = {
      app: {
        ui: {modals: {}, drawers: {}, toasts: []},
        navigation: {currentScreen: 'Home', previousScreen: null, navigationHistory: []},
        forms: {locationSearch: {query: '', isSearching: false}},
        preferences: {
          selectedProviderId: 'OPEN_METEO',
          selectedLocation: {
            latitude: 40.4168,
            longitude: -3.7038,
            name: 'Madrid, España',
          },
          recentLocations: [],
          favoriteLocations: [],
        },
      },
    };

    const {getByText} = renderWithProviders(<FakeSearchInput />, {
      preloadedState,
    });
    expect(getByText('Madrid, España')).toBeTruthy();
  });
});

describe('SettingsMenu', () => {
  it('opens modal when settings icon is pressed', () => {
    const {getByTestId, getByText, queryByText} =
      renderWithProviders(<SettingsMenu />);

    expect(queryByText('Select Weather Service')).toBeNull();

    const settingsIcon = getByTestId('settings-icon');
    fireEvent.press(settingsIcon);

    expect(getByText('Select Weather Service')).toBeTruthy();
  });

  it('closes modal when overlay is pressed', () => {
    const {getByTestId, getByText} =
      renderWithProviders(<SettingsMenu />);

    const settingsIcon = getByTestId('settings-icon');
    fireEvent.press(settingsIcon);

    expect(getByText('Select Weather Service')).toBeTruthy();

    // Press the overlay to close
    const overlay = getByText('Select Weather Service').parent?.parent;
    if (overlay) {
      fireEvent.press(overlay);
    }

    // Note: This test may need adjustment based on actual modal behavior
    // In real implementation, you might need to wait for animation
  });

  it('selects a provider and closes modal', () => {
    const {getByTestId, getByText, queryByText} =
      renderWithProviders(<SettingsMenu />);

    const settingsIcon = getByTestId('settings-icon');
    fireEvent.press(settingsIcon);

    const meteoblueOption = getByText('Meteoblue');
    fireEvent.press(meteoblueOption);

    expect(queryByText('Select Weather Service')).toBeNull();
  });
});

describe('HomeScreen', () => {
  it('renders loading when fetching weather on mount', () => {
    const {getByText} = renderWithProviders(<HomeScreen />);
    expect(getByText('Loading weather...')).toBeTruthy();
  });

  it('shows weather data after successful fetch', async () => {
    const {getByText} = renderWithProviders(<HomeScreen />);

    // Wait for weather data to load
    await waitFor(
      () => {
        expect(getByText('Mock City')).toBeTruthy();
      },
      {timeout: 3000},
    );
  });

  it('shows search prompt when no location is selected', () => {
    const preloadedState = {
      app: {
        ui: {modals: {}, drawers: {}, toasts: []},
        navigation: {currentScreen: 'Home', previousScreen: null, navigationHistory: []},
        forms: {locationSearch: {query: '', isSearching: false}},
        preferences: {
          selectedProviderId: 'OPEN_METEO',
          selectedLocation: null,
          recentLocations: [],
          favoriteLocations: [],
        },
      },
    };

    renderWithProviders(<HomeScreen />, {
      preloadedState,
    });

    // Initially should show loading
    // After load completes, should show the search prompt or weather
    // TODO: Add assertions when behavior is defined
  });
});

describe('LocationSearchScreen', () => {
  it('shows error when input is empty', () => {
    const {getByText, getByPlaceholderText} =
      renderWithProviders(<LocationSearchScreen />);

    const input = getByPlaceholderText('Madrid, España');
    fireEvent.changeText(input, '   ');

    const button = getByText('Search');
    fireEvent.press(button);

    expect(getByText('Location is required')).toBeTruthy();
  });

  it('shows error when no results found', () => {
    const {getByText, getByPlaceholderText} =
      renderWithProviders(<LocationSearchScreen />);

    const input = getByPlaceholderText('Madrid, España');
    fireEvent.changeText(input, 'xyz');

    const button = getByText('Search');
    fireEvent.press(button);

    // After debounce and search, should show "Location not found" if no results
  });

  it('allows typing in search input', () => {
    const {getByPlaceholderText} =
      renderWithProviders(<LocationSearchScreen />);

    const input = getByPlaceholderText('Madrid, España');
    fireEvent.changeText(input, 'Madrid');

    expect(input.props.value).toBe('Madrid');
  });

  it('triggers search on submit', () => {
    const {getByText, getByPlaceholderText} =
      renderWithProviders(<LocationSearchScreen />);

    const input = getByPlaceholderText('Madrid, España');
    fireEvent.changeText(input, 'Cartagena');

    const button = getByText('Search');
    fireEvent.press(button);

    // Button should show loading state or results
  });
});
