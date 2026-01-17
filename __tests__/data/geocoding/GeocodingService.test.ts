import type { HttpClient } from '../../../src/data/http/HttpClient';
import { GeocodingService } from '../../../src/data/geocoding/GeocodingService.tsx';

describe('GeocodingService', () => {
  let mockHttpClient: jest.Mocked<HttpClient>;
  let service: GeocodingService;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
    };
    service = new GeocodingService(mockHttpClient);
  });

  describe('searchLocationsByName', () => {
    it('returns locations when API returns results', async () => {
      mockHttpClient.get.mockResolvedValue([
        {
          place_id: 1,
          lat: '40.4168',
          lon: '-3.7038',
          display_name: 'Madrid, Community of Madrid, Spain',
          address: {
            city: 'Madrid',
            state: 'Community of Madrid',
            country: 'Spain',
          },
        },
        {
          place_id: 2,
          lat: '39.4688',
          lon: '-106.1172',
          display_name: 'Madrid, Colorado, United States',
          address: {
            city: 'Madrid',
            state: 'Colorado',
            country: 'United States',
          },
        },
      ]);

      const locations = await service.searchLocationsByName('Madrid');

      expect(locations).toHaveLength(2);
      expect(locations[0]).toEqual({
        latitude: 40.4168,
        longitude: -3.7038,
        name: 'Madrid, Community of Madrid, Spain',
      });
      expect(locations[1]).toEqual({
        latitude: 39.4688,
        longitude: -106.1172,
        name: 'Madrid, Colorado, United States',
      });
    });

    it('returns empty array when API returns no results', async () => {
      mockHttpClient.get.mockResolvedValue([]);

      const locations = await service.searchLocationsByName('NonexistentPlace');

      expect(locations).toEqual([]);
    });

    it('returns empty array when results is not an array', async () => {
      mockHttpClient.get.mockResolvedValue({});

      const locations = await service.searchLocationsByName('Test');

      expect(locations).toEqual([]);
    });

    it('uses fallback name when display_name is missing', async () => {
      mockHttpClient.get.mockResolvedValue([
        {
          place_id: 1,
          lat: '40.4168',
          lon: '-3.7038',
          address: {
            city: 'Madrid',
            country: 'Spain',
          },
        },
      ]);

      const locations = await service.searchLocationsByName('Madrid');

      expect(locations[0].name).toBe('Madrid');
    });
  });

  describe('searchFirstLocationByName', () => {
    it('returns first location when results exist', async () => {
      mockHttpClient.get.mockResolvedValue([
        {
          place_id: 1,
          lat: '41.3874',
          lon: '2.1686',
          display_name: 'Barcelona, Catalonia, Spain',
          address: {
            city: 'Barcelona',
            state: 'Catalonia',
            country: 'Spain',
          },
        },
      ]);

      const location = await service.searchFirstLocationByName('Barcelona');

      expect(location).toEqual({
        latitude: 41.3874,
        longitude: 2.1686,
        name: 'Barcelona, Catalonia, Spain',
      });
    });

    it('returns null when no results', async () => {
      mockHttpClient.get.mockResolvedValue([]);

      const location = await service.searchFirstLocationByName(
        'NonexistentPlace',
      );

      expect(location).toBeNull();
    });
  });

  describe('reverseGeocode', () => {
    it('returns display_name when API returns a result', async () => {
      mockHttpClient.get.mockResolvedValue({
        place_id: 1,
        lat: '39.4699',
        lon: '-0.3763',
        display_name: 'Valencia, Valencian Community, Spain',
        address: {
          city: 'Valencia',
          state: 'Valencian Community',
          country: 'Spain',
        },
      });

      const name = await service.reverseGeocode(39.4699, -0.3763);

      expect(name).toBe('Valencia, Valencian Community, Spain');
    });

    it('returns "Current location" when API returns no result', async () => {
      mockHttpClient.get.mockResolvedValue(null);

      const name = await service.reverseGeocode(0, 0);

      expect(name).toBe('Current location');
    });

    it('returns "Current location" when API throws an error', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      const name = await service.reverseGeocode(39.4699, -0.3763);

      expect(name).toBe('Current location');
    });
  });
});
