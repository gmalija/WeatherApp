import { Location } from '../entities/Location';
import { WeatherProviderId } from '../valueObjects/WeatherProviderId';
import { WeatherForecast } from '../entities/WeatherForecast';

export interface WeatherRepository {
  getWeatherByLocation(
    location: Location,
    providerId: WeatherProviderId,
  ): Promise<WeatherForecast>;
}
