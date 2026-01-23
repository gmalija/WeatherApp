import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {WeatherProviderId} from '../../domain/valueObjects/WeatherProviderId';
import {WeatherProviderIds} from '../../domain/valueObjects/WeatherProviderId';
import type {Location} from '../../domain/entities/Location';

/**
 * App State - UI state, navigation, forms, and user preferences
 * This slice does NOT contain server state (weather data, locations)
 * Server state is managed by React Query
 */

// UI State
interface UIState {
  modals: {
    settingsOpen: boolean;
    locationSearchOpen: boolean;
  };
  drawers: {
    menuOpen: boolean;
  };
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>;
}

// Navigation State
interface NavigationState {
  currentScreen: string;
  previousScreen: string | null;
  navigationHistory: string[];
}

// Form State
interface FormState {
  locationSearch: {
    query: string;
    isSearching: boolean;
  };
}

// User Preferences (stored in Redux for complex state logic)
interface PreferencesState {
  selectedProviderId: WeatherProviderId;
  selectedLocation: Location | null;
  recentLocations: Location[];
  favoriteLocations: Location[];
}

export interface AppState {
  ui: UIState;
  navigation: NavigationState;
  forms: FormState;
  preferences: PreferencesState;
}

const initialState: AppState = {
  ui: {
    modals: {
      settingsOpen: false,
      locationSearchOpen: false,
    },
    drawers: {
      menuOpen: false,
    },
    toasts: [],
  },
  navigation: {
    currentScreen: 'Home',
    previousScreen: null,
    navigationHistory: ['Home'],
  },
  forms: {
    locationSearch: {
      query: '',
      isSearching: false,
    },
  },
  preferences: {
    selectedProviderId: WeatherProviderIds.OPEN_METEO,
    selectedLocation: null,
    recentLocations: [],
    favoriteLocations: [],
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // UI Actions
    openModal(state, action: PayloadAction<keyof UIState['modals']>) {
      state.ui.modals[action.payload] = true;
    },
    closeModal(state, action: PayloadAction<keyof UIState['modals']>) {
      state.ui.modals[action.payload] = false;
    },
    toggleDrawer(state, action: PayloadAction<keyof UIState['drawers']>) {
      state.ui.drawers[action.payload] = !state.ui.drawers[action.payload];
    },
    showToast(
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info';
      }>,
    ) {
      const id = Date.now().toString();
      state.ui.toasts.push({id, ...action.payload});
    },
    hideToast(state, action: PayloadAction<string>) {
      state.ui.toasts = state.ui.toasts.filter(
        toast => toast.id !== action.payload,
      );
    },
    clearToasts(state) {
      state.ui.toasts = [];
    },

    // Navigation Actions
    setCurrentScreen(
      state,
      action: PayloadAction<{current: string; previous?: string}>,
    ) {
      state.navigation.previousScreen =
        action.payload.previous ?? state.navigation.currentScreen;
      state.navigation.currentScreen = action.payload.current;
      state.navigation.navigationHistory.push(action.payload.current);
    },
    clearNavigationHistory(state) {
      state.navigation.navigationHistory = [state.navigation.currentScreen];
    },

    // Form Actions
    setLocationSearchQuery(state, action: PayloadAction<string>) {
      state.forms.locationSearch.query = action.payload;
    },
    setLocationSearching(state, action: PayloadAction<boolean>) {
      state.forms.locationSearch.isSearching = action.payload;
    },
    clearLocationSearchForm(state) {
      state.forms.locationSearch.query = '';
      state.forms.locationSearch.isSearching = false;
    },

    // Preferences Actions
    setSelectedProviderId(state, action: PayloadAction<WeatherProviderId>) {
      state.preferences.selectedProviderId = action.payload;
    },
    setSelectedLocation(state, action: PayloadAction<Location | null>) {
      state.preferences.selectedLocation = action.payload;
      // Add to recent locations if not null
      if (action.payload) {
        const exists = state.preferences.recentLocations.some(
          loc =>
            loc.latitude === action.payload!.latitude &&
            loc.longitude === action.payload!.longitude,
        );
        if (!exists) {
          state.preferences.recentLocations.unshift(action.payload);
          // Keep only last 10 recent locations
          if (state.preferences.recentLocations.length > 10) {
            state.preferences.recentLocations.pop();
          }
        }
      }
    },
    addFavoriteLocation(state, action: PayloadAction<Location>) {
      const exists = state.preferences.favoriteLocations.some(
        loc =>
          loc.latitude === action.payload.latitude &&
          loc.longitude === action.payload.longitude,
      );
      if (!exists) {
        state.preferences.favoriteLocations.push(action.payload);
      }
    },
    removeFavoriteLocation(state, action: PayloadAction<Location>) {
      state.preferences.favoriteLocations =
        state.preferences.favoriteLocations.filter(
          loc =>
            loc.latitude !== action.payload.latitude ||
            loc.longitude !== action.payload.longitude,
        );
    },
    clearRecentLocations(state) {
      state.preferences.recentLocations = [];
    },
  },
});

export const {
  // UI
  openModal,
  closeModal,
  toggleDrawer,
  showToast,
  hideToast,
  clearToasts,
  // Navigation
  setCurrentScreen,
  clearNavigationHistory,
  // Forms
  setLocationSearchQuery,
  setLocationSearching,
  clearLocationSearchForm,
  // Preferences
  setSelectedProviderId,
  setSelectedLocation,
  addFavoriteLocation,
  removeFavoriteLocation,
  clearRecentLocations,
} = appSlice.actions;

export const appReducer = appSlice.reducer;
