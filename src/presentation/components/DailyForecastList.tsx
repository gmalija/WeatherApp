import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import type { DailyWeather } from '../../domain/entities/WeatherForecast';
import type { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { getThemeForProvider } from '../theme';
import { getWeatherIcon } from '../utils/weatherIcons';

interface Props {
  providerId: WeatherProviderId;
  days: DailyWeather[];
}

export function DailyForecastList({ providerId, days }: Props) {
  const theme = getThemeForProvider(providerId);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Next week
      </Text>
      <FlatList
        data={days}
        keyExtractor={item => item.date.toISOString()}
        renderItem={({ item }) => {
          const icon = getWeatherIcon(item.weatherCode, providerId);

          return (
            <View style={styles.row}>
              <Text style={[styles.date, { color: theme.colors.text }]}>
                {formatDate(item.date)}
              </Text>
              <Text style={styles.icon}>{icon}</Text>
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
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.colors.separator }]} />
        )}
      />
    </View>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en', {
    weekday: 'short', day: 'numeric'
  });
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8
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
    paddingVertical: 12,
  },
  date: {
    fontSize: 14,
  },
  icon: {
    width: 28,
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 6
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
    height: 1
  },
});
