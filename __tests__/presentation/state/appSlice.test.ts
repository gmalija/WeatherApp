import {
  appReducer,
  setSelectedProviderId,
  setSelectedLocation,
  addFavoriteLocation,
  removeFavoriteLocation,
  showToast,
  hideToast,
  clearToasts,
  openModal,
  closeModal,
} from '../../../src/presentation/state/appSlice';
import {WeatherProviderIds} from '../../../src/domain/valueObjects/WeatherProviderId';
import type {Location} from '../../../src/domain/entities/Location';

describe('appSlice', () => {
  const initialState = {
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

  it('should return initial state', () => {
    expect(appReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  describe('Provider Selection', () => {
    it('should set selected provider', () => {
      const actual = appReducer(
        initialState,
        setSelectedProviderId(WeatherProviderIds.METEOBLUE),
      );
      expect(actual.preferences.selectedProviderId).toEqual(
        WeatherProviderIds.METEOBLUE,
      );
    });
  });

  describe('Location Selection', () => {
    const testLocation: Location = {
      latitude: 40.4168,
      longitude: -3.7038,
      name: 'Madrid, España',
    };

    it('should set selected location', () => {
      const actual = appReducer(initialState, setSelectedLocation(testLocation));
      expect(actual.preferences.selectedLocation).toEqual(testLocation);
    });

    it('should add selected location to recent locations', () => {
      const actual = appReducer(initialState, setSelectedLocation(testLocation));
      expect(actual.preferences.recentLocations).toHaveLength(1);
      expect(actual.preferences.recentLocations[0]).toEqual(testLocation);
    });

    it('should not duplicate recent locations', () => {
      let state = appReducer(initialState, setSelectedLocation(testLocation));
      state = appReducer(state, setSelectedLocation(testLocation));
      expect(state.preferences.recentLocations).toHaveLength(1);
    });

    it('should limit recent locations to 10', () => {
      let state = initialState;
      for (let i = 0; i < 15; i++) {
        const location: Location = {
          latitude: i,
          longitude: i,
          name: `Location ${i}`,
        };
        state = appReducer(state, setSelectedLocation(location));
      }
      expect(state.preferences.recentLocations).toHaveLength(10);
    });
  });

  describe('Favorite Locations', () => {
    const testLocation: Location = {
      latitude: 40.4168,
      longitude: -3.7038,
      name: 'Madrid, España',
    };

    it('should add favorite location', () => {
      const actual = appReducer(initialState, addFavoriteLocation(testLocation));
      expect(actual.preferences.favoriteLocations).toHaveLength(1);
      expect(actual.preferences.favoriteLocations[0]).toEqual(testLocation);
    });

    it('should not duplicate favorite locations', () => {
      let state = appReducer(initialState, addFavoriteLocation(testLocation));
      state = appReducer(state, addFavoriteLocation(testLocation));
      expect(state.preferences.favoriteLocations).toHaveLength(1);
    });

    it('should remove favorite location', () => {
      let state = appReducer(initialState, addFavoriteLocation(testLocation));
      state = appReducer(state, removeFavoriteLocation(testLocation));
      expect(state.preferences.favoriteLocations).toHaveLength(0);
    });
  });

  describe('UI State - Toasts', () => {
    it('should show toast', () => {
      const actual = appReducer(
        initialState,
        showToast({message: 'Test message', type: 'success'}),
      );
      expect(actual.ui.toasts).toHaveLength(1);
      expect(actual.ui.toasts[0].message).toBe('Test message');
      expect(actual.ui.toasts[0].type).toBe('success');
    });

    it('should hide specific toast', () => {
      let state = appReducer(
        initialState,
        showToast({message: 'Test 1', type: 'success'}),
      );
      const toastId = state.ui.toasts[0].id;
      state = appReducer(state, hideToast(toastId));
      expect(state.ui.toasts).toHaveLength(0);
    });

    it('should clear all toasts', () => {
      let state = appReducer(
        initialState,
        showToast({message: 'Test 1', type: 'success'}),
      );
      state = appReducer(state, showToast({message: 'Test 2', type: 'error'}));
      expect(state.ui.toasts).toHaveLength(2);
      state = appReducer(state, clearToasts());
      expect(state.ui.toasts).toHaveLength(0);
    });
  });

  describe('UI State - Modals', () => {
    it('should open modal', () => {
      const actual = appReducer(initialState, openModal('settingsOpen'));
      expect(actual.ui.modals.settingsOpen).toBe(true);
    });

    it('should close modal', () => {
      let state = appReducer(initialState, openModal('settingsOpen'));
      state = appReducer(state, closeModal('settingsOpen'));
      expect(state.ui.modals.settingsOpen).toBe(false);
    });
  });
});
