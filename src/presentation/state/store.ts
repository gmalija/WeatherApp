import {configureStore} from '@reduxjs/toolkit';
import {appReducer} from './appSlice';

/**
 * Redux store for application state only
 * Server state (weather data, locations) is managed by React Query
 * Context API manages theme, language, session, flags, and config
 */
export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: ['app/setSelectedLocation', 'app/addFavoriteLocation'],
        // Ignore these paths in the state for serializability check
        ignoredPaths: [
          'app.preferences.selectedLocation',
          'app.preferences.recentLocations',
          'app.preferences.favoriteLocations',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
