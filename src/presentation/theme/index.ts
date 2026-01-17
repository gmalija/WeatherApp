import type { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { WeatherProviderIds } from '../../domain/valueObjects/WeatherProviderId';

export interface GeneralColors {
  background: string;
  surface: string; // For cards, modals, etc.
  text: string;
  mutedText: string;
  border: string;
  separator: string;
  primary: string; // Blue for buttons
  error: string; // Red for errors
  inputBackground: string;
  modalBackground: string;
  headerBackground: string;
  headerText: string;
}

export const lightColors: GeneralColors = {
  background: '#ffffff',
  surface: '#f3f4f6',
  text: '#111827',
  mutedText: '#6b7280',
  border: '#d1d5db',
  separator: '#e5e7eb',
  primary: '#2563eb',
  error: '#f97373',
  inputBackground: '#f3f4f6',
  modalBackground: '#ffffff',
  headerBackground: '#ffffff',
  headerText: '#111827',
};

export const darkColors: GeneralColors = {
  background: '#020617',
  surface: '#020617', // Or a slightly different shade if needed
  text: '#f9fafb',
  mutedText: '#9ca3af',
  border: '#374151',
  separator: '#4b5563',
  primary: '#2563eb', // Same or adjust
  error: '#f97373',
  inputBackground: 'transparent',
  modalBackground: '#020617',
  headerBackground: '#020617',
  headerText: '#f9fafb',
};

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
    separator: '#d2efc7',
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

export function getGeneralColors(isDarkMode: boolean): GeneralColors {
  return isDarkMode ? darkColors : lightColors;
}

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
