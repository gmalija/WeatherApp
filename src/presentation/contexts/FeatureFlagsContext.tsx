import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

export interface FeatureFlags {
  enableDarkMode: boolean;
  enableLocationSearch: boolean;
  enableMultipleProviders: boolean;
  enablePushNotifications: boolean;
  enableOfflineMode: boolean;
  enableWeatherAlerts: boolean;
}

const defaultFlags: FeatureFlags = {
  enableDarkMode: true,
  enableLocationSearch: true,
  enableMultipleProviders: true,
  enablePushNotifications: false,
  enableOfflineMode: false,
  enableWeatherAlerts: false,
};

interface FeatureFlagsContextValue {
  flags: FeatureFlags;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
  setFeatureFlag: (feature: keyof FeatureFlags, enabled: boolean) => void;
  resetFlags: () => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(
  undefined,
);

interface FeatureFlagsProviderProps {
  children: ReactNode;
  initialFlags?: Partial<FeatureFlags>;
}

/**
 * FeatureFlagsContext manages feature toggles for the application
 * Useful for A/B testing, gradual rollouts, and enabling/disabling features
 */
export function FeatureFlagsProvider({
  children,
  initialFlags,
}: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>({
    ...defaultFlags,
    ...initialFlags,
  });

  const isFeatureEnabled = useCallback(
    (feature: keyof FeatureFlags): boolean => {
      return flags[feature];
    },
    [flags],
  );

  const setFeatureFlag = useCallback(
    (feature: keyof FeatureFlags, enabled: boolean) => {
      setFlags(prev => ({...prev, [feature]: enabled}));
      // TODO: Persist to AsyncStorage
    },
    [],
  );

  const resetFlags = useCallback(() => {
    setFlags(defaultFlags);
    // TODO: Clear from AsyncStorage
  }, []);

  const value: FeatureFlagsContextValue = {
    flags,
    isFeatureEnabled,
    setFeatureFlag,
    resetFlags,
  };

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagsContextValue {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error(
      'useFeatureFlags must be used within a FeatureFlagsProvider',
    );
  }
  return context;
}
