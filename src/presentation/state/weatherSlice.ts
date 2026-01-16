import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import type { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { WeatherProviderIds } from '../../domain/valueObjects/WeatherProviderId';
import type { Location } from '../../domain/entities/Location';
import type { WeatherForecast } from '../../domain/entities/WeatherForecast';
import { weatherDependencies } from '../../application/weatherDependencies';

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

export const fetchWeatherByLocation = createAsyncThunk<WeatherForecast, { location: Location }>(
  'weather/fetchByLocation',
  async ({ location }, thunkApi) => {
    const state: any = thunkApi.getState();
    const providerId: WeatherProviderId = state.weather.selectedProviderId;

    return weatherDependencies.getWeatherByLocationUseCase.execute(location, providerId);
  },
);

export const fetchWeatherByPlaceName = createAsyncThunk<WeatherForecast, { name: string }>(
  'weather/fetchByPlaceName',
  async ({ name }, thunkApi) => {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Location is required');
    }

    const state: any = thunkApi.getState();
    const providerId: WeatherProviderId = state.weather.selectedProviderId;

    const location = await weatherDependencies.geocodingService.searchFirstLocationByName(trimmed);
    if (!location) {
      throw new Error('Location not found');
    }

    return weatherDependencies.getWeatherByLocationUseCase.execute(location, providerId);
  },
);

export const fetchWeatherForCurrentLocation = createAsyncThunk<WeatherForecast, void>(
  'weather/fetchForCurrentLocation',
  async (_, thunkApi) => {
    const state: any = thunkApi.getState();
    const providerId: WeatherProviderId = state.weather.selectedProviderId;

    return weatherDependencies.getWeatherForCurrentLocationUseCase.execute(providerId);
  },
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedProviderId(state, action: PayloadAction<WeatherProviderId>) {
      state.selectedProviderId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentForecast = action.payload;
        state.currentLocation = action.payload.location;
      })
.addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Failed to load weather';
      })
      .addCase(fetchWeatherByPlaceName.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWeatherByPlaceName.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentForecast = action.payload;
        state.currentLocation = action.payload.location;
      })
      .addCase(fetchWeatherByPlaceName.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Failed to load weather';
      })
      .addCase(fetchWeatherForCurrentLocation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWeatherForCurrentLocation.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentForecast = action.payload;
        state.currentLocation = action.payload.location;
      })
      .addCase(fetchWeatherForCurrentLocation.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Failed to load weather for current location';
      });
  },
});

export const { setSelectedProviderId } = weatherSlice.actions;
export const weatherReducer = weatherSlice.reducer;
