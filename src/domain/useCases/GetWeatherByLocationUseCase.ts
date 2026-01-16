import { WeatherRepository } from '../repositories/WeatherRepository';
import { Location } from '../entities/Location';
import { WeatherProviderId } from '../valueObjects/WeatherProviderId';
import { WeatherForecast } from '../entities/WeatherForecast';

export class GetWeatherByLocationUseCase {
  private readonly weatherRepository: WeatherRepository;

  constructor(weatherRepository: WeatherRepository) {
    this.weatherRepository = weatherRepository;
  }

  execute(location: Location, providerId: WeatherProviderId): Promise<WeatherForecast> {
    return this.weatherRepository.getWeatherByLocation(location, providerId);
  }
}
