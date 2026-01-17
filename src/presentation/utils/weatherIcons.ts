import {
  WeatherProviderId,
  WeatherProviderIds,
} from '../../domain/valueObjects/WeatherProviderId';

/**
 * Provider code systems:
 *
 * Open-Meteo => WMO 4677 weather codes
 * https://open-meteo.com/en/docs#weathervariables
 *
 * Meteoblue => pictocode / pictocode_detailed (1–35)
 * https://docs.meteoblue.com/en/meteo/variables/pictograms
 */

// -----------------------------------------------------------------------------
// 1) Open-Meteo (WMO 4677)
// -----------------------------------------------------------------------------

const OPEN_METEO_ICON: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅️',
  3: '☁️',

  45: '🌫️',
  48: '🌫️',

  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️🧊',
  57: '🌧️🧊',

  61: '🌧️',
  63: '🌧️',
  65: '🌧️🌧️',
  66: '🌧️🧊',
  67: '🌧️🧊',

  71: '🌨️',
  73: '🌨️',
  75: '❄️❄️',
  77: '🌨️',

  80: '🌦️',
  81: '🌧️',
  82: '🌧️🌧️',

  85: '🌨️',
  86: '❄️❄️',

  95: '⛈️',
  96: '⛈️🧊',
  99: '⛈️🧊',
};

const OPEN_METEO_DESC: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',

  45: 'Fog',
  48: 'Depositing rime fog',

  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',

  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',

  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',

  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',

  85: 'Slight snow showers',
  86: 'Heavy snow showers',

  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

// -----------------------------------------------------------------------------
// 2) Meteoblue (pictocode_detailed 1–35)
// -----------------------------------------------------------------------------

const METEOBLUE_ICON: Record<number, string> = {
  1: '☀️',
  2: '🌤️',
  3: '⛅️',
  4: '☁️',
  5: '🌫️',

  6: '🌧️',
  7: '🌦️',
  8: '⛈️',

  9: '🌨️',
  10: '🌨️',
  11: '🌨️',

  12: '🌦️',
  13: '🌨️',
  14: '🌧️',
  15: '🌨️',
  16: '🌦️',
  17: '🌨️',

  18: '🌥️',
  19: '🌥️',
  20: '☁️',

  21: '🌧️',
  22: '🌧️',
  23: '⛈️',

  24: '🌨️',
  25: '🌨️',

  26: '🌧️',
  27: '🌧️',

  28: '🌨️',
  29: '🌨️',

  30: '🌩️',
  31: '🌦️',
  32: '🌨️',
  33: '🌫️',
  34: '🌨️',
  35: '🌪️',
};

const METEOBLUE_DESC: Record<number, string> = {
  1: 'Sunny, cloudless sky',
  2: 'Sunny and few clouds',
  3: 'Partly cloudy',
  4: 'Overcast',
  5: 'Fog',

  6: 'Overcast with rain',
  7: 'Mixed with showers',
  8: 'Showers, thunderstorms likely',

  9: 'Overcast with snowfall',
  10: 'Mixed with snow showers',
  11: 'Mostly cloudy with snow',

  12: 'Overcast with light rain',
  13: 'Overcast with light snow',
  14: 'Mostly cloudy with rain',
  15: 'Mostly cloudy with snow',
  16: 'Mostly cloudy with light rain',
  17: 'Mostly cloudy with light snow',

  18: 'Mostly clear',
  19: 'Mostly clear',
  20: 'Cloudy',

  21: 'Cloudy with rain',
  22: 'Cloudy with showers',
  23: 'Cloudy with thunderstorms',

  24: 'Cloudy with snowfall',
  25: 'Cloudy with snow showers',

  26: 'Rain',
  27: 'Heavy rain',

  28: 'Snowfall',
  29: 'Heavy snowfall',

  30: 'Thunderstorm',
  31: 'Light showers',
  32: 'Light snow showers',
  33: 'Dense fog / mist',
  34: 'Sleet (rain & snow)',
  35: 'Storm / extreme weather',
};

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

const FALLBACK_ICON = '🌡️';

function getProviderMaps(providerId: WeatherProviderId) {
  return providerId === WeatherProviderIds.METEOBLUE
    ? { icon: METEOBLUE_ICON, desc: METEOBLUE_DESC }
    : { icon: OPEN_METEO_ICON, desc: OPEN_METEO_DESC };
}

export function getWeatherIcon(
  weatherCode: number,
  providerId: WeatherProviderId,
): string {
  const { icon } = getProviderMaps(providerId);
  return icon[weatherCode] ?? FALLBACK_ICON;
}

export function getWeatherDescription(
  weatherCode: number,
  providerId: WeatherProviderId,
): string {
  const { desc } = getProviderMaps(providerId);
  return desc[weatherCode] ?? `Unknown (${weatherCode})`;
}

/**
 * Optional: single function returning both fields.
 */
export function getWeatherUI(
  weatherCode: number,
  providerId: WeatherProviderId,
) {
  const { icon, desc } = getProviderMaps(providerId);
  return {
    icon: icon[weatherCode] ?? FALLBACK_ICON,
    description: desc[weatherCode] ?? `Unknown (${weatherCode})`,
  };
}
