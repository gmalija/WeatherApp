import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { useAppDispatch, useAppSelector } from '../state/hooks';
import { setSelectedProviderId, fetchWeatherByLocation } from '../state/weatherSlice';
import { WeatherProviderIds } from '../../domain/valueObjects/WeatherProviderId';
import { getThemeForProvider } from '../theme';

export function ProviderToggleIcon() {
  const dispatch = useAppDispatch();
  const { selectedProviderId, currentLocation } = useAppSelector((state) => state.weather);

  const currentTheme = getThemeForProvider(selectedProviderId);

  const nextProviderId =
    selectedProviderId === WeatherProviderIds.OPEN_METEO
      ? WeatherProviderIds.METEOBLUE
      : WeatherProviderIds.OPEN_METEO;

  const onPress = () => {
    dispatch(setSelectedProviderId(nextProviderId));

    if (currentLocation) {
      dispatch(fetchWeatherByLocation({ location: currentLocation }));
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: currentTheme.colors.accent }]}
    >
      <Text style={[styles.text, { color: currentTheme.colors.text }]}>{currentTheme.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
