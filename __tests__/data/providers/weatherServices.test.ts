import { OpenMeteoWeatherService } from '../../../src/data/providers/openMeteo/OpenMeteoWeatherService';
import { MeteoblueWeatherService } from '../../../src/data/providers/meteoblue/MeteoblueWeatherService';
import type { HttpClient } from '../../../src/data/http/HttpClient';
import type { Location } from '../../../src/domain/entities/Location';
import type { OpenMeteoResponse } from '../../../src/data/mappers/openMeteoWeatherMapper';
import type { MeteoblueResponse } from '../../../src/data/mappers/meteoblueWeatherMapper';
import { WeatherProviderIds } from '../../../src/domain/valueObjects/WeatherProviderId';

function createMockHttpClient<TResponse>(response: TResponse) {
  const get = jest.fn<Promise<TResponse>, [string, { query: Record<string, unknown> }]>().mockResolvedValue(
    response,
  );

  const httpClient: HttpClient = {
    // @ts-expect-error - we only implement the overload we use in tests
    get,
  };

  return { httpClient, get };
}

describe('OpenMeteoWeatherService', () => {
  it('calls HttpClient.get with correct URL and query and maps response', async () => {
    const location: Location = {
      latitude: 52.52,
      longitude: 13.41,
      name: 'Berlin',
    };

    const openMeteoResponse: OpenMeteoResponse = {
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
        time: ['2026-01-16'],
        weather_code: [3],
        temperature_2m_max: [7.5],
        temperature_2m_min: [1.7],
        wind_speed_10m_max: [11.5],
        precipitation_sum: [0],
      },
    };

    const { httpClient, get } = createMockHttpClient(openMeteoResponse);
    const service = new OpenMeteoWeatherService(httpClient, 'https://api.open-meteo.com/v1/forecast');

    const forecast = await service.getWeatherByLocation(location);

    expect(get).toHaveBeenCalledTimes(1);

    const [url, options] = get.mock.calls[0];
    expect(url).toBe('https://api.open-meteo.com/v1/forecast');
    expect(options.query).toEqual({
      latitude: 52.52,
      longitude: 13.41,
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,rain_sum,precipitation_sum',
      current: 'temperature_2m,wind_speed_10m,precipitation,rain,weather_code',
      timezone: 'auto',
    });

    expect(forecast.location).toEqual(location);
    expect(forecast.providerId).toBe(WeatherProviderIds.OPEN_METEO);
    expect(forecast.current.temperature).toBe(6.7);
    expect(forecast.daily).toHaveLength(1);
  });
});

describe('MeteoblueWeatherService', () => {
  it('calls HttpClient.get with correct URL and query and maps response', async () => {
    const location: Location = {
      latitude: 47.56,
      longitude: 7.57,
      name: 'Basel',
    };

    const meteoblueResponse: MeteoblueResponse = {
      metadata: {
        latitude: 47.56,
        longitude: 7.57,
      },
      data_1h: {
        time: ['2026-01-16 00:00', '2026-01-16 12:00'],
        temperature: [5, 7],
        windspeed: [1, 3],
        precipitation: [0, 0.5],
        pictocode: [1, 2],
      },
    };

    const { httpClient, get } = createMockHttpClient(meteoblueResponse);
    const apiKey = 'TEST_KEY';
    const service = new MeteoblueWeatherService(
      httpClient,
      apiKey,
      'https://my.meteoblue.com/packages/basic-1h_basic-day',
    );

    const forecast = await service.getWeatherByLocation(location);

    expect(get).toHaveBeenCalledTimes(1);

    const [url, options] = get.mock.calls[0];
    expect(url).toBe('https://my.meteoblue.com/packages/basic-1h_basic-day');
    expect(options.query).toEqual({
      lat: 47.56,
      lon: 7.57,
      apikey: apiKey,
    });

    expect(forecast.location).toEqual(location);
    expect(forecast.providerId).toBe(WeatherProviderIds.METEOBLUE);
    expect(forecast.current.temperature).toBe(5);
    expect(forecast.daily.length).toBeGreaterThanOrEqual(1);
  });
});
