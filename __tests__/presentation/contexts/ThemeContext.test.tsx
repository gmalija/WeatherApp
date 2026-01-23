import React from 'react';
import {renderHook, act} from '@testing-library/react-native';
import {ThemeProvider, useTheme} from '../../../src/presentation/contexts/ThemeContext';
import {WeatherProviderIds} from '../../../src/domain/valueObjects/WeatherProviderId';

describe('ThemeContext', () => {
  it('provides default theme with OPEN_METEO provider', () => {
    const {result} = renderHook(() => useTheme(), {
      wrapper: ({children}) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.providerId).toBe(WeatherProviderIds.OPEN_METEO);
    expect(result.current.theme).toBeDefined();
    expect(result.current.theme.colors).toBeDefined();
    expect(result.current.theme.provider).toBeDefined();
  });

  it('allows changing provider', () => {
    const {result} = renderHook(() => useTheme(), {
      wrapper: ({children}) => <ThemeProvider>{children}</ThemeProvider>,
    });

    act(() => {
      result.current.setProviderId(WeatherProviderIds.METEOBLUE);
    });

    expect(result.current.providerId).toBe(WeatherProviderIds.METEOBLUE);
    expect(result.current.theme.provider.id).toBe(WeatherProviderIds.METEOBLUE);
  });

  it('allows toggling color scheme', () => {
    const {result} = renderHook(() => useTheme(), {
      wrapper: ({children}) => <ThemeProvider>{children}</ThemeProvider>,
    });

    const initialScheme = result.current.colorScheme;

    act(() => {
      result.current.toggleColorScheme();
    });

    expect(result.current.colorScheme).not.toBe(initialScheme);
  });

  it('provides different theme colors for different providers', () => {
    const {result} = renderHook(() => useTheme(), {
      wrapper: ({children}) => <ThemeProvider>{children}</ThemeProvider>,
    });

    const openMeteoColor = result.current.theme.colors.primary;

    act(() => {
      result.current.setProviderId(WeatherProviderIds.METEOBLUE);
    });

    const meteoblueColor = result.current.theme.colors.primary;

    expect(openMeteoColor).not.toBe(meteoblueColor);
  });

  it('throws error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });
});
