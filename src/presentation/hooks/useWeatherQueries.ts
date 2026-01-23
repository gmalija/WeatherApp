import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import type {WeatherForecast} from '../../domain/entities/WeatherForecast';
import type {Location} from '../../domain/entities/Location';
import type {WeatherProviderId} from '../../domain/valueObjects/WeatherProviderId';
import {weatherDependencies} from '../../application/weatherDependencies';
import {queryKeys} from '../../config/queryClient';

/**
 * Hook to fetch weather data for a specific location
 * Uses React Query for caching and automatic refetching
 */
export function useWeatherByLocation(
  location: Location | null,
  providerId: WeatherProviderId,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: location
      ? queryKeys.weather.byLocation(
          location.latitude,
          location.longitude,
          providerId,
        )
      : [],
    queryFn: async () => {
      if (!location) {
        throw new Error('Location is required');
      }
      return weatherDependencies.getWeatherByLocationUseCase.execute(
        location,
        providerId,
      );
    },
    enabled: options?.enabled !== false && location !== null,
  });
}

/**
 * Hook to fetch weather data for the device's current location
 */
export function useWeatherForCurrentLocation(
  providerId: WeatherProviderId,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: [...queryKeys.weather.current(), providerId],
    queryFn: async () => {
      return weatherDependencies.getWeatherForCurrentLocationUseCase.execute(
        providerId,
      );
    },
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to search for a location by name and fetch weather data
 * This is a mutation since it performs a search first, then fetches weather
 */
export function useWeatherByPlaceName(providerId: WeatherProviderId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (placeName: string): Promise<WeatherForecast> => {
      const trimmed = placeName.trim();
      if (!trimmed) {
        throw new Error('Location is required');
      }

      // First, search for the location
      const location =
        await weatherDependencies.geocodingService.searchFirstLocationByName(
          trimmed,
        );
      if (!location) {
        throw new Error('Location not found');
      }

      // Then fetch weather for that location
      return weatherDependencies.getWeatherByLocationUseCase.execute(
        location,
        providerId,
      );
    },
    onSuccess: (data) => {
      // Cache the result in the location-specific query
      queryClient.setQueryData(
        queryKeys.weather.byLocation(
          data.location.latitude,
          data.location.longitude,
          providerId,
        ),
        data,
      );
    },
  });
}

/**
 * Hook to search for locations by name (for autocomplete/search)
 */
export function useLocationSearch(searchQuery: string) {
  return useQuery({
    queryKey: queryKeys.location.search(searchQuery),
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return [];
      }
      return weatherDependencies.geocodingService.searchLocationsByName(
        searchQuery.trim(),
      );
    },
    enabled: searchQuery.trim().length > 0,
    staleTime: 10 * 60 * 1000, // Location search results are valid for 10 minutes
  });
}

/**
 * Hook to invalidate all weather queries
 * Useful when switching providers or forcing a refresh
 */
export function useInvalidateWeather() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.weather.all,
    });
  };
}
