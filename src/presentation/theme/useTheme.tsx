import { useColorScheme } from 'react-native';
import { useAppSelector } from '../state/hooks';
import { getTheme, ColorScheme } from './index';

export function useTheme() {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const providerId = useAppSelector(s => s.weather.selectedProviderId);

  return getTheme({ providerId, scheme });
}