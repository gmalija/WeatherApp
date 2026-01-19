import { useColorScheme } from 'react-native';
import { useWeather } from '../viewModels/WeatherContext';
import { getTheme, ColorScheme } from './index';

export function useTheme() {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { selectedProviderId } = useWeather();

  return getTheme({ providerId: selectedProviderId, scheme });
}