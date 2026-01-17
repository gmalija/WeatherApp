import type { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { WeatherProviderIds } from '../../domain/valueObjects/WeatherProviderId';

export interface ProviderThemeColors {
  background: string;
  primary: string;
  accent: string;
  text: string;
  cardBackground: string;
  mutedText: string;
  separator: string;
}

export interface ProviderTheme {
  id: WeatherProviderId;
  label: string;
  colors: ProviderThemeColors;
}

const openMeteoTheme: ProviderTheme = {
  id: WeatherProviderIds.OPEN_METEO,
  label: 'Open-Meteo',
  colors: {
    background: '#282928',
    primary: '#22c55e',
    accent: '#4ade80',
    text: '#f9fafb',
    cardBackground: '#909f8f',
    mutedText: '#9ca3af',
    separator: '#e4efdf',
  },
};

const meteoblueTheme: ProviderTheme = {
  id: WeatherProviderIds.METEOBLUE,
  label: 'Meteoblue',
  colors: {
    background: '#0b172a',
    primary: '#1d4ed8',
    accent: '#38bdf8',
    text: '#f9fafb',
    cardBackground: '#585891',
    mutedText: '#9ca3af',
    separator: '#374151',
  },
};

export function getThemeForProvider(providerId: WeatherProviderId): ProviderTheme {
  switch (providerId) {
    case WeatherProviderIds.OPEN_METEO:
      return openMeteoTheme;
    case WeatherProviderIds.METEOBLUE:
      return meteoblueTheme;
    default:
      return openMeteoTheme;
  }
}
