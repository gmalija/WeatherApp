import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import {useColorScheme} from 'react-native';
import type {ColorScheme, AppTheme} from '../theme';
import {getTheme} from '../theme';
import type {WeatherProviderId} from '../../domain/valueObjects/WeatherProviderId';
import {WeatherProviderIds} from '../../domain/valueObjects/WeatherProviderId';

interface ThemeContextValue {
  theme: AppTheme;
  colorScheme: ColorScheme;
  providerId: WeatherProviderId;
  setProviderId: (providerId: WeatherProviderId) => void;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    systemColorScheme === 'dark' ? 'dark' : 'light',
  );
  const [providerId, setProviderIdState] = useState<WeatherProviderId>(
    WeatherProviderIds.OPEN_METEO,
  );

  // Update color scheme when system preference changes
  useEffect(() => {
    if (systemColorScheme) {
      setColorSchemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [systemColorScheme]);

  const theme = getTheme({providerId, scheme: colorScheme});

  const setProviderId = useCallback((newProviderId: WeatherProviderId) => {
    setProviderIdState(newProviderId);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorSchemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  const value: ThemeContextValue = {
    theme,
    colorScheme,
    providerId,
    setProviderId,
    toggleColorScheme,
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
