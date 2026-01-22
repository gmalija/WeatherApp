import {
  getWeatherIcon,
  getWeatherDescription,
} from '../../src/presentation/utils/weatherIcons';
import { WeatherProviderIds } from '../../src/domain/valueObjects/WeatherProviderId';

describe('weatherIcons', () => {
  describe('getWeatherIcon', () => {
    describe('Open-Meteo provider', () => {
      it('returns sun emoji for clear sky (code 0)', () => {
        expect(getWeatherIcon(0, WeatherProviderIds.OPEN_METEO)).toBe('☀️');
      });

      it('returns cloud emoji for overcast (code 3)', () => {
        expect(getWeatherIcon(3, WeatherProviderIds.OPEN_METEO)).toBe('☁️');
      });

      it('returns rain emoji for rain (code 63)', () => {
        expect(getWeatherIcon(63, WeatherProviderIds.OPEN_METEO)).toBe('🌧️');
      });

      it('returns snow emoji for snow (code 73)', () => {
        expect(getWeatherIcon(73, WeatherProviderIds.OPEN_METEO)).toBe('🌨️');
      });

      it('returns thunderstorm emoji for thunderstorm (code 95)', () => {
        expect(getWeatherIcon(95, WeatherProviderIds.OPEN_METEO)).toBe('⛈️');
      });

      it('returns fallback emoji for unknown code', () => {
        expect(getWeatherIcon(999, WeatherProviderIds.OPEN_METEO)).toBe('🌡️');
      });
    });

    describe('Meteoblue provider', () => {
      it('returns sun emoji for clear sky (pictocode 1)', () => {
        expect(getWeatherIcon(1, WeatherProviderIds.METEOBLUE)).toBe('☀️');
      });

      it('returns cloud emoji for overcast (pictocode 4)', () => {
        expect(getWeatherIcon(4, WeatherProviderIds.METEOBLUE)).toBe('☁️');
      });

      it('returns rain emoji for rain (pictocode 6)', () => {
        expect(getWeatherIcon(6, WeatherProviderIds.METEOBLUE)).toBe('🌧️');
      });

      it('returns thunderstorm emoji for thunderstorm (pictocode 8)', () => {
        expect(getWeatherIcon(8, WeatherProviderIds.METEOBLUE)).toBe('⛈️');
      });

      it('returns rain emoji for cloudy with rain (pictocode 21)', () => {
        expect(getWeatherIcon(21, WeatherProviderIds.METEOBLUE)).toBe('🌧️');
      });

      it('returns fallback emoji for unknown pictocode', () => {
        expect(getWeatherIcon(999, WeatherProviderIds.METEOBLUE)).toBe('🌡️');
      });
    });
  });

  describe('getWeatherDescription', () => {
    describe('Open-Meteo provider', () => {
      it('returns "Clear sky" for code 0', () => {
        expect(getWeatherDescription(0, WeatherProviderIds.OPEN_METEO)).toBe(
          'Clear sky',
        );
      });

      it('returns "Overcast" for code 3', () => {
        expect(getWeatherDescription(3, WeatherProviderIds.OPEN_METEO)).toBe(
          'Overcast',
        );
      });

      it('returns "Moderate rain" for code 63', () => {
        expect(getWeatherDescription(63, WeatherProviderIds.OPEN_METEO)).toBe(
          'Moderate rain',
        );
      });

      it('returns Unknown(code) for unknown code', () => {
        expect(getWeatherDescription(999, WeatherProviderIds.OPEN_METEO)).toBe(
          'Unknown (999)',
        );
      });
    });

    describe('Meteoblue provider', () => {
      it('returns "Sunny, cloudless sky" for pictocode 1', () => {
        expect(getWeatherDescription(1, WeatherProviderIds.METEOBLUE)).toBe(
          'Sunny, cloudless sky',
        );
      });

      it('returns "Overcast" for pictocode 4', () => {
        expect(getWeatherDescription(4, WeatherProviderIds.METEOBLUE)).toBe(
          'Overcast',
        );
      });

      it('returns "Overcast with rain" for pictocode 6', () => {
        expect(getWeatherDescription(6, WeatherProviderIds.METEOBLUE)).toBe(
          'Overcast with rain',
        );
      });

      it('returns "Cloudy with rain" for pictocode 21', () => {
        expect(getWeatherDescription(21, WeatherProviderIds.METEOBLUE)).toBe(
          'Cloudy with rain',
        );
      });

      it('returns Unknown(code) for unknown pictocode', () => {
        expect(getWeatherDescription(999, WeatherProviderIds.METEOBLUE)).toBe(
          'Unknown (999)',
        );
      });
    });
  });
});