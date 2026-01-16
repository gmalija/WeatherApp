import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import type { DailyWeather } from '../../domain/entities/WeatherForecast';
import type { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { getThemeForProvider } from '../theme';

interface Props {
  providerId: WeatherProviderId;
  days: DailyWeather[];
}

export function DailyForecastList({ providerId, days }: Props) {
  const theme = getThemeForProvider(providerId);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Next days</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => item.date.toISOString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.date, { color: theme.colors.text }]}>{formatDate(item.date)}</Text>
            <Text style={[styles.temp, { color: theme.colors.text }]}>
              {Math.round(item.minTemp)}° / {Math.round(item.maxTemp)}°
            </Text>
            <Text style={[styles.detail, { color: theme.colors.mutedText }]}>
              {Math.round(item.windSpeedMax)} km/h
            </Text>
            <Text style={[styles.detail, { color: theme.colors.mutedText }]}>
              {item.precipitationSum.toFixed(1)} mm
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  date: {
    flex: 1,
    fontSize: 14,
  },
  temp: {
    width: 80,
    fontSize: 14,
    textAlign: 'right',
  },
  detail: {
    width: 80,
    fontSize: 12,
    textAlign: 'right',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#374151',
  },
});
