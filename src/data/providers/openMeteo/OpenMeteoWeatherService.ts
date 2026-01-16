import { Location } from '../../../domain/entities/Location';
import { WeatherForecast } from '../../../domain/entities/WeatherForecast';
import { WeatherProviderId, WeatherProviderIds } from '../../../domain/valueObjects/WeatherProviderId';
import { HttpClient } from '../../http/HttpClient';
import { WeatherProviderService } from '../WeatherProviderService';
import { mapOpenMeteoToWeatherForecast, OpenMeteoResponse } from '../../mappers/openMeteoWeatherMapper';

export class OpenMeteoWeatherService implements WeatherProviderService {
  readonly id: WeatherProviderId = WeatherProviderIds.OPEN_METEO;

  private readonly httpClient: HttpClient;

  private readonly baseUrl: string;

  constructor(httpClient: HttpClient, baseUrl = 'https://api.open-meteo.com/v1/forecast') {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  async getWeatherByLocation(location: Location): Promise<WeatherForecast> {
    const query = {
      latitude: location.latitude,
      longitude: location.longitude,
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,rain_sum,precipitation_sum',
      current: 'temperature_2m,wind_speed_10m,precipitation,rain,weather_code',
      timezone: 'auto',
    };

    const response = await this.httpClient.get<OpenMeteoResponse>(this.baseUrl, { query });

    return mapOpenMeteoToWeatherForecast(response, location, this.id);
  }
}
