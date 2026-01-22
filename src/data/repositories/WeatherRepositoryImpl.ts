import { WeatherRepository } from '../../domain/repositories/WeatherRepository';
import { Location } from '../../domain/entities/Location';
import { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { WeatherForecast } from '../../domain/entities/WeatherForecast';
import { WeatherProviderService } from '../providers/WeatherProviderService';

export class WeatherRepositoryImpl implements WeatherRepository {
  private readonly providers: Map<WeatherProviderId, WeatherProviderService>;

  constructor(services: WeatherProviderService[]) {
    this.providers = new Map(services.map((service) => [service.id, service]));
  }

  async getWeatherByLocation(location: Location, providerId: WeatherProviderId): Promise<WeatherForecast> {
    const provider = this.providers.get(providerId);

    if (!provider) {
      throw new Error(`Unknown weather provider: ${providerId}`);
    }

    return provider.getWeatherByLocation(location);
  }
}
