/**
 * Test utilities for setting up providers and mocks
 */

import React, {type ReactElement} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {render, type RenderOptions} from '@testing-library/react-native';
import {Provider as ReduxProvider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {configureStore} from '@reduxjs/toolkit';

import {
  ThemeProvider,
  LanguageProvider,
  SessionProvider,
  FeatureFlagsProvider,
  AppConfigProvider,
} from '../../src/presentation/contexts';
import {appReducer} from '../../src/presentation/state/appSlice';

/**
 * Create a test Redux store
 */
export function createTestStore(preloadedState?: any) {
  return configureStore({
    reducer: {
      app: appReducer,
    },
    preloadedState,
  });
}

/**
 * Create a test QueryClient with disabled retries and caching
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * All providers wrapper for testing
 */
interface AllProvidersProps {
  children: React.ReactNode;
  store?: ReturnType<typeof createTestStore>;
  queryClient?: QueryClient;
}

export function AllProviders({
  children,
  store,
  queryClient,
}: AllProvidersProps) {
  const testStore = store || createTestStore();
  const testQueryClient = queryClient || createTestQueryClient();

  return (
    <ReduxProvider store={testStore}>
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <SessionProvider>
              <FeatureFlagsProvider>
                <AppConfigProvider>
                  <NavigationContainer>{children}</NavigationContainer>
                </AppConfigProvider>
              </FeatureFlagsProvider>
            </SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

/**
 * Custom render function with all providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {},
) {
  function Wrapper({children}: {children: React.ReactNode}) {
    return (
      <AllProviders store={store} queryClient={queryClient}>
        {children}
      </AllProviders>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, {wrapper: Wrapper, ...renderOptions}),
  };
}

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react-native';
