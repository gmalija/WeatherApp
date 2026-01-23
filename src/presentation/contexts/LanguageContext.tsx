import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

// Simple translation system - can be replaced with i18next later
const translations: Record<Language, Record<string, string>> = {
  en: {
    'weather.title': 'Weather',
    'weather.loading': 'Loading...',
    'weather.error': 'Error loading weather',
    'location.search': 'Search location',
    'location.current': 'Current location',
    'provider.openmeteo': 'Open-Meteo',
    'provider.meteoblue': 'Meteoblue',
  },
  es: {
    'weather.title': 'Clima',
    'weather.loading': 'Cargando...',
    'weather.error': 'Error al cargar el clima',
    'location.search': 'Buscar ubicación',
    'location.current': 'Ubicación actual',
    'provider.openmeteo': 'Open-Meteo',
    'provider.meteoblue': 'Meteoblue',
  },
  fr: {
    'weather.title': 'Météo',
    'weather.loading': 'Chargement...',
    'weather.error': 'Erreur de chargement',
    'location.search': 'Rechercher un lieu',
    'location.current': 'Position actuelle',
    'provider.openmeteo': 'Open-Meteo',
    'provider.meteoblue': 'Meteoblue',
  },
  de: {
    'weather.title': 'Wetter',
    'weather.loading': 'Laden...',
    'weather.error': 'Fehler beim Laden',
    'location.search': 'Ort suchen',
    'location.current': 'Aktueller Standort',
    'provider.openmeteo': 'Open-Meteo',
    'provider.meteoblue': 'Meteoblue',
  },
};

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] || key;
    },
    [language],
  );

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
