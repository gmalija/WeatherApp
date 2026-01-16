export type WeatherProviderId = 'OPEN_METEO' | 'METEOBLUE';

export const WeatherProviderIds = {
  OPEN_METEO: 'OPEN_METEO' as WeatherProviderId,
  METEOBLUE: 'METEOBLUE' as WeatherProviderId,
} as const;
