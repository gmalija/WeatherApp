import { WeatherProviderId, WeatherProviderIds } from '../../domain/valueObjects/WeatherProviderId';

/**
 * Maps weather codes to emoji icons.
 *
 * Open-Meteo uses WMO weather codes:
 * https://open-meteo.com/en/docs#weathervariables
 *
 * Meteoblue uses pictocode (1-17):
 * https://docs.meteoblue.com/en/meteo/data-api/overview#pictocode
 */

// Open-Meteo WMO weather codes mapping
const openMeteoIconMap: Record<number, string> = {
  0: '☀️', // Clear sky
  1: '🌤️', // Mainly clear
  2: '⛅', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Fog
  48: '🌫️', // Depositing rime fog
  51: '🌧️', // Drizzle: Light
  53: '🌧️', // Drizzle: Moderate
  55: '🌧️', // Drizzle: Dense
  56: '🌧️', // Freezing Drizzle: Light
  57: '🌧️', // Freezing Drizzle: Dense
  61: '🌧️', // Rain: Slight
  63: '🌧️', // Rain: Moderate
  65: '🌧️', // Rain: Heavy
  66: '🌧️', // Freezing Rain: Light
  67: '🌧️', // Freezing Rain: Heavy
  71: '🌨️', // Snow fall: Slight
  73: '🌨️', // Snow fall: Moderate
  75: '🌨️', // Snow fall: Heavy
  77: '🌨️', // Snow grains
  80: '🌦️', // Rain showers: Slight
  81: '🌦️', // Rain showers: Moderate
  82: '🌦️', // Rain showers: Violent
  85: '🌨️', // Snow showers: Slight
  86: '🌨️', // Snow showers: Heavy
  95: '⛈️', // Thunderstorm: Slight or moderate
  96: '⛈️', // Thunderstorm with slight hail
  99: '⛈️', // Thunderstorm with heavy hail
};

// Meteoblue pictocode mapping (1-17)
const meteoblueIconMap: Record<number, string> = {
  1: '☀️', // Sunny, cloudless sky
  2: '🌤️', // Sunny and few clouds
  3: '⛅', // Partly cloudy
  4: '☁️', // Overcast
  5: '🌫️', // Fog
  6: '🌧️', // Overcast with rain
  7: '🌦️', // Mixed with showers
  8: '⛈️', // Showers, thunderstorms likely
  9: '☁️', // Overcast with snow
  10: '🌨️', // Mixed with snow showers
  11: '🌨️', // Mostly cloudy with snow
  12: '🌧️', // Overcast with light rain
  13: '🌨️', // Overcast with light snow
  14: '🌧️', // Mostly cloudy with rain
  15: '🌨️', // Mostly cloudy with snow
  16: '🌧️', // Mostly cloudy with light rain
  17: '🌨️', // Mostly cloudy with light snow
};

export function getWeatherIcon(weatherCode: number, providerId: WeatherProviderId): string {
  if (providerId === WeatherProviderIds.METEOBLUE) {
    return meteoblueIconMap[weatherCode] ?? '🌡️';
  }

  // Open-Meteo (default)
  return openMeteoIconMap[weatherCode] ?? '🌡️';
}

export function getWeatherDescription(weatherCode: number, providerId: WeatherProviderId): string {
  if (providerId === WeatherProviderIds.METEOBLUE) {
    const descriptions: Record<number, string> = {
      1: 'Clear',
      2: 'Mostly clear',
      3: 'Partly cloudy',
      4: 'Overcast',
      5: 'Fog',
      6: 'Rain',
      7: 'Showers',
      8: 'Thunderstorm',
      9: 'Snow',
      10: 'Snow showers',
      11: 'Snow',
      12: 'Light rain',
      13: 'Light snow',
      14: 'Rain',
      15: 'Snow',
      16: 'Light rain',
      17: 'Light snow',
    };
    return descriptions[weatherCode] ?? 'Unknown';
  }

  // Open-Meteo WMO codes
  const descriptions: Record<number, string> = {
    0: 'Clear',
    1: 'Mostly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Freezing rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light showers',
    81: 'Showers',
    82: 'Heavy showers',
    85: 'Snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm',
  };
  return descriptions[weatherCode] ?? 'Unknown';
}
