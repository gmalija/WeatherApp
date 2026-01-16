import { GetWeatherByLocationUseCase } from '../../../src/domain/useCases/GetWeatherByLocationUseCase';
import { WeatherRepository } from '../../../src/domain/repositories/WeatherRepository';
import { WeatherProviderId, WeatherProviderIds } from '../../../src/domain/valueObjects/WeatherProviderId';
import { Location } from '../../../src/domain/entities/Location';
import { WeatherForecast } from '../../../src/domain/entities/WeatherForecast';

function createDummyForecast(location: Location, providerId: WeatherProviderId): WeatherForecast {
  return {
    location,
    providerId,
    current: {
      time: new Date('2026-01-16T12:00:00Z'),
      temperature: 10,
      windSpeed: 5,
      precipitation: 0,
      weatherCode: 1,
    },
    daily: [],
  };
}

describe('GetWeatherByLocationUseCase', () => {
  it('delegates to WeatherRepository with the same arguments and returns its result', async () => {
    const location: Location = {
      latitude: 52.52,
      longitude: 13.41,
      name: 'Berlin',
    };
    const providerId: WeatherProviderId = WeatherProviderIds.OPEN_METEO;
    const expectedForecast = createDummyForecast(location, providerId);

    const weatherRepository: WeatherRepository = {
      getWeatherByLocation: jest.fn().mockResolvedValue(expectedForecast),
    };

    const useCase = new GetWeatherByLocationUseCase(weatherRepository);

    const result = await useCase.execute(location, providerId);

    expect(weatherRepository.getWeatherByLocation).toHaveBeenCalledTimes(1);
    expect(weatherRepository.getWeatherByLocation).toHaveBeenCalledWith(location, providerId);
    expect(result).toBe(expectedForecast);
  });
});
