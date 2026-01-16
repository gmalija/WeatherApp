import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type { WeatherForecast } from '../../domain/entities/WeatherForecast';
import { getThemeForProvider } from '../theme';

interface Props {
  forecast: WeatherForecast;
}

export function WeatherSummaryCard({ forecast }: Props) {
  const theme = getThemeForProvider(forecast.providerId);
  const { location, current } = forecast;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
      <Text style={[styles.location, { color: theme.colors.text }]}>{location.name}</Text>
      <Text style={[styles.provider, { color: theme.colors.mutedText }]}>{theme.label}</Text>

      <View style={styles.currentRow}>
        <Text style={[styles.temperature, { color: theme.colors.accent }]}>{Math.round(current.temperature)}°</Text>
        <View style={styles.currentDetails}>
          <Text style={[styles.detailText, { color: theme.colors.text }]}>Wind: {Math.round(current.windSpeed)} km/h</Text>
          <Text style={[styles.detailText, { color: theme.colors.text }]}>Precipitation: {current.precipitation.toFixed(1)} mm</Text>
          <Text style={[styles.detailText, { color: theme.colors.text }]}>Code: {current.weatherCode}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  location: {
    fontSize: 20,
    fontWeight: '600',
  },
  provider: {
    fontSize: 12,
    marginTop: 2,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    marginRight: 16,
  },
  currentDetails: {
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
