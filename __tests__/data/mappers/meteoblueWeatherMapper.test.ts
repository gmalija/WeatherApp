import { mapMeteoblueToWeatherForecast, MeteoblueResponse } from '../../../src/data/mappers/meteoblueWeatherMapper';
import { Location } from '../../../src/domain/entities/Location';
import { WeatherProviderIds } from '../../../src/domain/valueObjects/WeatherProviderId';

function createSampleResponse(): MeteoblueResponse {
  return {
    metadata: {
      latitude: 47.56,
      longitude: 7.57,
    },
    data_1h: {
      time: ['2026-01-16 00:00', '2026-01-16 12:00', '2026-01-17 00:00'],
      temperature: [5, 7, 10],
      windspeed: [1, 3, 2],
      precipitation: [0, 0.5, 1],
      pictocode: [1, 2, 3],
    },
  };
}

describe('mapMeteoblueToWeatherForecast', () => {
  it('maps Meteoblue response into domain WeatherForecast with aggregated daily data', () => {
    const response = createSampleResponse();
    const location: Location = {
      latitude: 47.56,
      longitude: 7.57,
      name: 'Basel',
    };

    const forecast = mapMeteoblueToWeatherForecast(response, location, WeatherProviderIds.METEOBLUE);

    expect(forecast.location).toEqual(location);
    expect(forecast.providerId).toBe(WeatherProviderIds.METEOBLUE);

    expect(forecast.current.temperature).toBe(5);
    expect(forecast.current.windSpeed).toBe(1);
    expect(forecast.current.precipitation).toBe(0);
    expect(forecast.current.weatherCode).toBe(1);

    expect(forecast.daily).toHaveLength(2);

    const firstDay = forecast.daily[0];
    expect(firstDay.minTemp).toBe(5);
    expect(firstDay.maxTemp).toBe(7);
    expect(firstDay.windSpeedMax).toBe(3);
    expect(firstDay.precipitationSum).toBe(0.5);
    expect(firstDay.weatherCode).toBe(1);

    const secondDay = forecast.daily[1];
    expect(secondDay.minTemp).toBe(10);
    expect(secondDay.maxTemp).toBe(10);
    expect(secondDay.windSpeedMax).toBe(2);
    expect(secondDay.precipitationSum).toBe(1);
    expect(secondDay.weatherCode).toBe(3);
  });
});
