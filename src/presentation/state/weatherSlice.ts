import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { WeatherProviderIds } from '../../domain/valueObjects/WeatherProviderId';
import type { Location } from '../../domain/entities/Location';
import type { WeatherForecast } from '../../domain/entities/WeatherForecast';

export interface WeatherState {
  selectedProviderId: WeatherProviderId;
  currentLocation: Location | null;
  currentForecast: WeatherForecast | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

const initialState: WeatherState = {
  selectedProviderId: WeatherProviderIds.OPEN_METEO,
  currentLocation: null,
  currentForecast: null,
  status: 'idle',
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedProviderId(state, action: PayloadAction<WeatherProviderId>) {
      state.selectedProviderId = action.payload;
    },
  },
});

export const { setSelectedProviderId } = weatherSlice.actions;
export const weatherReducer = weatherSlice.reducer;
