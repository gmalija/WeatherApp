import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';
import {QueryClientProvider} from '@tanstack/react-query';

import {RootNavigator} from './src/navigation/RootNavigator';
import {store} from './src/presentation/state/store';
import {queryClient} from './src/config/queryClient';
import {
  ThemeProvider,
  LanguageProvider,
  SessionProvider,
  FeatureFlagsProvider,
  AppConfigProvider,
  useTheme,
} from './src/presentation/contexts';

function AppContent() {
  const {theme} = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <SessionProvider>
              <FeatureFlagsProvider>
                <AppConfigProvider>
                  <AppContent />
                </AppConfigProvider>
              </FeatureFlagsProvider>
            </SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
