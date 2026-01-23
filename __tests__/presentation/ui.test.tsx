import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';

import { FakeSearchInput } from '../../src/presentation/components/FakeSearchInput';
import { HomeScreen } from '../../src/presentation/screens/HomeScreen/HomeScreen';
import { LocationSearchScreen } from '../../src/presentation/screens/LocationSearchScreen/LocationSearchScreen';
import type { WeatherForecast } from '../../src/domain/entities/WeatherForecast';
import { SettingsMenu } from '../../src/presentation/components/SettingsMenu.tsx';
import { WeatherProvider } from '../../src/presentation/viewModels/WeatherContext';

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

function wrapWithWeatherProviderAndNav(ui: React.ReactElement) {
  return render(
    <WeatherProvider>
      <NavigationContainer>{ui}</NavigationContainer>
    </WeatherProvider>,
  );
}

describe('FakeSearchInput', () => {
  it('shows placeholder when there is no current location', () => {
    const { getByText } = wrapWithWeatherProviderAndNav(<FakeSearchInput />);

    expect(getByText('Search location')).toBeTruthy();
  });
});

// ... existing imports and mocks ...

describe('SettingsMenu', () => {
  it('opens modal when settings icon is pressed', () => {
    const { getByTestId, getByText, queryByText } = wrapWithWeatherProviderAndNav(<SettingsMenu />);

    expect(queryByText('Select Weather Service')).toBeNull();

    const settingsIcon = getByTestId('settings-icon');
    fireEvent.press(settingsIcon);

    expect(getByText('Select Weather Service')).toBeTruthy();
  });

  it('closes modal when overlay is pressed', () => {
    const { getByTestId, getByText, queryByText } = wrapWithWeatherProviderAndNav(<SettingsMenu />);

    const settingsIcon = getByTestId('settings-icon');
    fireEvent.press(settingsIcon);

    expect(getByText('Select Weather Service')).toBeTruthy();

    // Press the overlay (assuming it's the modal's backdrop)
    const overlay = getByText('Select Weather Service').parent?.parent;
    if (overlay) fireEvent.press(overlay);

    expect(queryByText('Select Weather Service')).toBeNull();
  });

  it('selects a provider and closes modal', () => {
    const { getByTestId, getByText, queryByText } = wrapWithWeatherProviderAndNav(<SettingsMenu />);

    const settingsIcon = getByTestId('settings-icon');
    fireEvent.press(settingsIcon);

    const meteoblueOption = getByText('Meteoblue');
    fireEvent.press(meteoblueOption);

    expect(queryByText('Select Weather Service')).toBeNull();
  });
});

describe('HomeScreen', () => {
  it('renders loading when fetching weather on mount', () => {
    const { getByText } = wrapWithWeatherProviderAndNav(<HomeScreen />);

    expect(getByText('Loading weather...')).toBeTruthy();
  });
});

describe('LocationSearchScreen', () => {
  it('shows error when input is empty', () => {
    const { getByText, getByPlaceholderText } = wrapWithWeatherProviderAndNav(<LocationSearchScreen />);

    const input = getByPlaceholderText('Madrid, España');
    fireEvent.changeText(input, '   ');

    const button = getByText('Search');
    fireEvent.press(button);

    expect(getByText('Location is required')).toBeTruthy();
  });

  it('shows suggestions when searching and multiple locations are returned', async () => {
    const { getByPlaceholderText, getByText, findByText } = wrapWithWeatherProviderAndNav(<LocationSearchScreen />);

    const input = getByPlaceholderText('Madrid, España');
    fireEvent.changeText(input, 'Cart');

    const button = getByText('Search');
    fireEvent.press(button);

    await findByText('Select a location');
    await findByText('Cartagena, España');
  });
});
