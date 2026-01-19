import { useState, useEffect, useCallback } from 'react';
import { WeatherForecast } from '../../domain/entities/WeatherForecast';
import { Location } from '../../domain/entities/Location';
import { WeatherProviderId, WeatherProviderIds } from '../../domain/valueObjects/WeatherProviderId';
import { weatherDependencies } from '../../application/weatherDependencies';

export interface WeatherViewModelState {
  selectedProviderId: WeatherProviderId;
  currentLocation: Location | null;
  currentForecast: WeatherForecast | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

export interface WeatherViewModelActions {
  setProviderId: (providerId: WeatherProviderId) => void;
  fetchWeatherByLocation: (location: Location) => Promise<void>;
  fetchWeatherByPlaceName: (name: string) => Promise<void>;
  fetchWeatherForCurrentLocation: () => Promise<void>;
}

export function useWeatherViewModel(): WeatherViewModelState & WeatherViewModelActions {
  const [state, setState] = useState<WeatherViewModelState>({
    selectedProviderId: WeatherProviderIds.OPEN_METEO,
    currentLocation: null,
    currentForecast: null,
    status: 'idle',
    error: null,
  });

  const setProviderId = useCallback((providerId: WeatherProviderId) => {
    setState(prev => ({ ...prev, selectedProviderId: providerId }));
  }, []);

  const fetchWeatherByLocation = useCallback(async (location: Location) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const forecast = await weatherDependencies.getWeatherByLocationUseCase.execute(location, state.selectedProviderId);
      setState(prev => ({
        ...prev,
        currentLocation: location,
        currentForecast: forecast,
        status: 'success',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [state.selectedProviderId]);

  const fetchWeatherByPlaceName = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setState(prev => ({ ...prev, status: 'error', error: 'Location is required' }));
      return;
    }

    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const location = await weatherDependencies.geocodingService.searchFirstLocationByName(trimmed);
      if (!location) {
        throw new Error('Location not found');
      }
      const forecast = await weatherDependencies.getWeatherByLocationUseCase.execute(location, state.selectedProviderId);
      setState(prev => ({
        ...prev,
        currentLocation: location,
        currentForecast: forecast,
        status: 'success',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [state.selectedProviderId]);

  const fetchWeatherForCurrentLocation = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const forecast = await weatherDependencies.getWeatherForCurrentLocationUseCase.execute();
      setState(prev => ({
        ...prev,
        currentLocation: forecast.location,
        currentForecast: forecast,
        status: 'success',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, []);

  // Auto-fetch on mount if no forecast
  useEffect(() => {
    if (!state.currentForecast && state.status === 'idle') {
      fetchWeatherForCurrentLocation();
    }
  }, [state.currentForecast, state.status, fetchWeatherForCurrentLocation]);

  return {
    ...state,
    setProviderId,
    fetchWeatherByLocation,
    fetchWeatherByPlaceName,
    fetchWeatherForCurrentLocation,
  };
}