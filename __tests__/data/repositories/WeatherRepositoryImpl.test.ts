import { WeatherRepositoryImpl } from '../../../src/data/repositories/WeatherRepositoryImpl';
import { WeatherProviderService } from '../../../src/data/providers/WeatherProviderService';
import { WeatherProviderIds } from '../../../src/domain/valueObjects/WeatherProviderId';
import { Location } from '../../../src/domain/entities/Location';
import { WeatherForecast } from '../../../src/domain/entities/WeatherForecast';

function createDummyForecast(providerId: string): WeatherForecast {
  return {
    location: {
      latitude: 0,
      longitude: 0,
      name: 'Nowhere',
    },
    providerId: providerId as any,
    current: {
      time: new Date('2026-01-16T00:00:00Z'),
      temperature: 1,
      windSpeed: 1,
      precipitation: 0,
      weatherCode: 0,
    },
    daily: [],
  };
}

describe('WeatherRepositoryImpl', () => {
  it('delegates to the provider service matching the providerId', async () => {
    const location: Location = {
      latitude: 10,
      longitude: 20,
      name: 'Test',
    };

    const openMeteoService: WeatherProviderService = {
      id: WeatherProviderIds.OPEN_METEO,
      getWeatherByLocation: jest.fn().mockResolvedValue(createDummyForecast(WeatherProviderIds.OPEN_METEO)),
    };

    const meteoblueService: WeatherProviderService = {
      id: WeatherProviderIds.METEOBLUE,
      getWeatherByLocation: jest.fn().mockResolvedValue(createDummyForecast(WeatherProviderIds.METEOBLUE)),
    };

    const repository = new WeatherRepositoryImpl([openMeteoService, meteoblueService]);

    const result = await repository.getWeatherByLocation(location, WeatherProviderIds.METEOBLUE);

    expect(meteoblueService.getWeatherByLocation).toHaveBeenCalledTimes(1);
    expect(meteoblueService.getWeatherByLocation).toHaveBeenCalledWith(location);
    expect(openMeteoService.getWeatherByLocation).not.toHaveBeenCalled();
    expect(result.providerId).toBe(WeatherProviderIds.METEOBLUE);
  });

  it('throws if no provider service is registered for the given providerId', async () => {
    const location: Location = {
      latitude: 10,
      longitude: 20,
      name: 'Test',
    };

    const repository = new WeatherRepositoryImpl([]);

    await expect(
      repository.getWeatherByLocation(location, WeatherProviderIds.OPEN_METEO),
    ).rejects.toThrow('Unknown weather provider: OPEN_METEO');
  });
});
