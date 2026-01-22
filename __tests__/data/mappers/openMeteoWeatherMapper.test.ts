import { mapOpenMeteoToWeatherForecast, OpenMeteoResponse } from '../../../src/data/mappers/openMeteoWeatherMapper';
import { Location } from '../../../src/domain/entities/Location';
import { WeatherProviderIds } from '../../../src/domain/valueObjects/WeatherProviderId';

function createSampleResponse(): OpenMeteoResponse {
  return {
    latitude: 52.52,
    longitude: 13.41,
    current: {
      time: '2026-01-16T12:45:00Z',
      temperature_2m: 6.7,
      wind_speed_10m: 10.6,
      precipitation: 0,
      weather_code: 2,
    },
    daily: {
      time: ['2026-01-16', '2026-01-17'],
      weather_code: [3, 1],
      temperature_2m_max: [7.5, 2.8],
      temperature_2m_min: [1.7, -0.3],
      wind_speed_10m_max: [11.5, 14.7],
      precipitation_sum: [0, 1],
    },
  };
}

describe('mapOpenMeteoToWeatherForecast', () => {
  it('maps Open-Meteo response into domain WeatherForecast', () => {
    const response = createSampleResponse();
    const location: Location = {
      latitude: 52.52,
      longitude: 13.41,
      name: 'Berlin',
    };

    const forecast = mapOpenMeteoToWeatherForecast(response, location, WeatherProviderIds.OPEN_METEO);

    expect(forecast.location).toEqual(location);
    expect(forecast.providerId).toBe(WeatherProviderIds.OPEN_METEO);

    expect(forecast.current.temperature).toBe(6.7);
    expect(forecast.current.windSpeed).toBe(10.6);
    expect(forecast.current.precipitation).toBe(0);
    expect(forecast.current.weatherCode).toBe(2);

    expect(forecast.daily).toHaveLength(2);

    const firstDay = forecast.daily[0];
    expect(firstDay.minTemp).toBe(1.7);
    expect(firstDay.maxTemp).toBe(7.5);
    expect(firstDay.windSpeedMax).toBe(11.5);
    expect(firstDay.precipitationSum).toBe(0);
    expect(firstDay.weatherCode).toBe(3);
  });
});
