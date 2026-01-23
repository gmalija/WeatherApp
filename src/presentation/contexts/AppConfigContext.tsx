import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

export interface AppConfig {
  // API Configuration
  apiTimeout: number;
  apiRetryAttempts: number;

  // Cache Configuration
  cacheEnabled: boolean;
  cacheDuration: number; // in minutes

  // Location Configuration
  locationUpdateInterval: number; // in seconds
  enableBackgroundLocation: boolean;

  // UI Configuration
  animationsEnabled: boolean;
  hapticFeedbackEnabled: boolean;

  // Units
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'mph' | 'ms';
  precipitationUnit: 'mm' | 'inch';

  // Debug
  debugMode: boolean;
}

const defaultConfig: AppConfig = {
  // API
  apiTimeout: 10000,
  apiRetryAttempts: 2,

  // Cache
  cacheEnabled: true,
  cacheDuration: 5,

  // Location
  locationUpdateInterval: 300,
  enableBackgroundLocation: false,

  // UI
  animationsEnabled: true,
  hapticFeedbackEnabled: true,

  // Units
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  precipitationUnit: 'mm',

  // Debug
  debugMode: false,
};

interface AppConfigContextValue {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  resetConfig: () => void;
  setTemperatureUnit: (unit: 'celsius' | 'fahrenheit') => void;
  setWindSpeedUnit: (unit: 'kmh' | 'mph' | 'ms') => void;
  setPrecipitationUnit: (unit: 'mm' | 'inch') => void;
}

const AppConfigContext = createContext<AppConfigContextValue | undefined>(
  undefined,
);

interface AppConfigProviderProps {
  children: ReactNode;
  initialConfig?: Partial<AppConfig>;
}

/**
 * AppConfigContext manages application-wide configuration settings
 * Includes API, cache, location, UI preferences, and units
 */
export function AppConfigProvider({
  children,
  initialConfig,
}: AppConfigProviderProps) {
  const [config, setConfig] = useState<AppConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setConfig(prev => ({...prev, ...updates}));
    // TODO: Persist to AsyncStorage
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    // TODO: Clear from AsyncStorage
  }, []);

  const setTemperatureUnit = useCallback(
    (unit: 'celsius' | 'fahrenheit') => {
      updateConfig({temperatureUnit: unit});
    },
    [updateConfig],
  );

  const setWindSpeedUnit = useCallback(
    (unit: 'kmh' | 'mph' | 'ms') => {
      updateConfig({windSpeedUnit: unit});
    },
    [updateConfig],
  );

  const setPrecipitationUnit = useCallback(
    (unit: 'mm' | 'inch') => {
      updateConfig({precipitationUnit: unit});
    },
    [updateConfig],
  );

  const value: AppConfigContextValue = {
    config,
    updateConfig,
    resetConfig,
    setTemperatureUnit,
    setWindSpeedUnit,
    setPrecipitationUnit,
  };

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig(): AppConfigContextValue {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
}
