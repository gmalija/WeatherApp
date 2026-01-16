import { Location } from '../../../domain/entities/Location';
import { WeatherForecast } from '../../../domain/entities/WeatherForecast';
import { WeatherProviderId, WeatherProviderIds } from '../../../domain/valueObjects/WeatherProviderId';
import { HttpClient } from '../../http/HttpClient';
import { WeatherProviderService } from '../WeatherProviderService';
import { mapMeteoblueToWeatherForecast, MeteoblueResponse } from '../../mappers/meteoblueWeatherMapper';

export class MeteoblueWeatherService implements WeatherProviderService {
  readonly id: WeatherProviderId = WeatherProviderIds.METEOBLUE;

  private readonly httpClient: HttpClient;

  private readonly apiKey: string;

  private readonly baseUrl: string;

  constructor(httpClient: HttpClient, apiKey: string, baseUrl = 'https://my.meteoblue.com/packages/basic-1h_basic-day') {
    this.httpClient = httpClient;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getWeatherByLocation(location: Location): Promise<WeatherForecast> {
    const query = {
      lat: location.latitude,
      lon: location.longitude,
      apikey: this.apiKey,
    };

    const response = await this.httpClient.get<MeteoblueResponse>(this.baseUrl, { query });

    return mapMeteoblueToWeatherForecast(response, location, this.id);
  }
}
