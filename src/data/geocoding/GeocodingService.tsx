// src/data/geocoding/GeocodingService.ts
import type { Location } from '../../domain/entities/Location';
import type { HttpClient } from '../http/HttpClient';

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

export class GeocodingService {
  private readonly httpClient: HttpClient;
  private readonly baseUrl: string;

  constructor(
    httpClient: HttpClient,
    baseUrl = 'https://nominatim.openstreetmap.org',
  ) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await this.httpClient.get<NominatimResult>(
        `${this.baseUrl}/reverse`,
        {
          query: {
            format: 'json',
            lat: latitude.toString(),
            lon: longitude.toString(),
            zoom: '10', // City-level detail
          },
        },
      );

      console.log(response);

      if (response && response.display_name) {
        return response.display_name;
      }

      return 'Current location';
    } catch {
      return 'Current location';
    }
  }

  async searchLocationsByName(query: string): Promise<Location[]> {
    const response = await this.httpClient.get<NominatimResult[]>(
      `${this.baseUrl}/search`,
      {
        query: {
          format: 'json',
          q: query,
          limit: '5',
          addressdetails: '1',
        },
      },
    );

    if (!Array.isArray(response) || response.length === 0) {
      return [];
    }

    return response.map(result => {
      const name =
        result.display_name ||
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        'Unknown';

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        name,
      };
    });
  }

  async searchFirstLocationByName(query: string): Promise<Location | null> {
    const locations = await this.searchLocationsByName(query);
    return locations[0] ?? null;
  }
}