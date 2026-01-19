import React, { createContext, useContext, ReactNode } from 'react';
import { useWeatherViewModel, WeatherViewModelState, WeatherViewModelActions } from '../viewModels/useWeatherViewModel';

const WeatherContext = createContext<(WeatherViewModelState & WeatherViewModelActions) | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const weatherViewModel = useWeatherViewModel();

  return (
    <WeatherContext.Provider value={weatherViewModel}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}