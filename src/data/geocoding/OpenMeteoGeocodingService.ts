import type { Location } from '../../domain/entities/Location';
import type { HttpClient } from '../http/HttpClient';

interface OpenMeteoGeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

export class OpenMeteoGeocodingService {
  private readonly httpClient: HttpClient;
  private readonly baseUrl: string;

  constructor(httpClient: HttpClient, baseUrl = 'https://geocoding-api.open-meteo.com/v1/search') {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  async searchLocationsByName(query: string): Promise<Location[]> {
    const response = await this.httpClient.get<OpenMeteoGeocodingResponse>(this.baseUrl, {
      query: {
        name: query,
        count: 5,
      },
    });

    if (!response.results || response.results.length === 0) {
      return [];
    }

    return response.results.map((result) => {
      const parts = [result.name, result.admin1, result.country].filter(Boolean) as string[];
      const name = parts.join(', ');

      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name,
      };
    });
  }

  async searchFirstLocationByName(query: string): Promise<Location | null> {
    const locations = await this.searchLocationsByName(query);
    return locations[0] ?? null;
  }
}
