import { WeatherRepository } from '../repositories/WeatherRepository';
import { WeatherProviderId } from '../valueObjects/WeatherProviderId';
import { WeatherForecast } from '../entities/WeatherForecast';
import { LocationProvider } from '../location/LocationProvider';

export class GetWeatherForCurrentLocationUseCase {
  private readonly locationProvider: LocationProvider;
  private readonly weatherRepository: WeatherRepository;

  constructor(locationProvider: LocationProvider, weatherRepository: WeatherRepository) {
    this.locationProvider = locationProvider;
    this.weatherRepository = weatherRepository;
  }

  async execute(providerId: WeatherProviderId): Promise<WeatherForecast> {
    const location = await this.locationProvider.getCurrentLocation();

    return this.weatherRepository.getWeatherByLocation(location, providerId);
  }
}
