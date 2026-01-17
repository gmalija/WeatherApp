import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type { WeatherForecast } from '../../domain/entities/WeatherForecast';
import { getThemeForProvider } from '../theme';
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherIcons';

interface Props {
  forecast: WeatherForecast;
}

export function WeatherSummaryCard({ forecast }: Props) {
  const theme = getThemeForProvider(forecast.providerId);
  const { location, current, providerId } = forecast;

  const weatherIcon = getWeatherIcon(current.weatherCode, providerId);
  const weatherDescription = getWeatherDescription(current.weatherCode, providerId);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
      <Text style={[styles.location, { color: theme.colors.text }]}>{location.name}</Text>
      <Text style={[styles.provider, { color: theme.colors.mutedText }]}>{theme.label}</Text>

      <View style={styles.currentRow}>
        <View style={styles.temperatureContainer}>
          <Text style={[styles.temperature, { color: theme.colors.accent }]}>{Math.round(current.temperature)}°</Text>
          <Text style={styles.weatherIcon}>{weatherIcon}</Text>
        </View>
        <View style={styles.currentDetails}>
          <Text style={[styles.weatherDescription, { color: theme.colors.text }]}>{weatherDescription}</Text>
          <Text style={[styles.detailText, { color: theme.colors.text }]}>Wind: {Math.round(current.windSpeed)} km/h</Text>
          <Text style={[styles.detailText, { color: theme.colors.text }]}>Precipitation: {current.precipitation.toFixed(1)} mm</Text>
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
  temperatureContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
  },
  weatherIcon: {
    fontSize: 32,
    marginTop: 4,
  },
  currentDetails: {
    flex: 1,
  },
  weatherDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
