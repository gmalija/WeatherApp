import { Location } from '../../domain/entities/Location';
import { WeatherForecast } from '../../domain/entities/WeatherForecast';
import { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';

export interface WeatherProviderService {
  readonly id: WeatherProviderId;

  getWeatherByLocation(location: Location): Promise<WeatherForecast>;
}
