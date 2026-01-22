import { GetWeatherForCurrentLocationUseCase } from '../../../src/domain/useCases/GetWeatherForCurrentLocationUseCase';
import { WeatherRepository } from '../../../src/domain/repositories/WeatherRepository';
import { LocationProvider } from '../../../src/domain/location/LocationProvider';
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

describe('GetWeatherForCurrentLocationUseCase', () => {
  it('retrieves current location and then asks repository for weather using the given provider', async () => {
    const currentLocation: Location = {
      latitude: 40.4168,
      longitude: -3.7038,
      name: 'Madrid',
    };
    const providerId: WeatherProviderId = WeatherProviderIds.METEOBLUE;
    const expectedForecast = createDummyForecast(currentLocation, providerId);

    const locationProvider: LocationProvider = {
      getCurrentLocation: jest.fn().mockResolvedValue(currentLocation),
    };

    const weatherRepository: WeatherRepository = {
      getWeatherByLocation: jest.fn().mockResolvedValue(expectedForecast),
    };

    const useCase = new GetWeatherForCurrentLocationUseCase(locationProvider, weatherRepository);

    const result = await useCase.execute(providerId);

    expect(locationProvider.getCurrentLocation).toHaveBeenCalledTimes(1);
    expect(weatherRepository.getWeatherByLocation).toHaveBeenCalledTimes(1);
    expect(weatherRepository.getWeatherByLocation).toHaveBeenCalledWith(currentLocation, providerId);
    expect(result).toBe(expectedForecast);
  });
});
