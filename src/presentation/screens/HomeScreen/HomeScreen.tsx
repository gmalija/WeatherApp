import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { fetchWeatherForCurrentLocation } from '../../state/weatherSlice';
import { WeatherSummaryCard } from '../../components/WeatherSummaryCard';
import { DailyForecastList } from '../../components/DailyForecastList';
import { getThemeForProvider } from '../../theme';

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const weather = useAppSelector((state) => state.weather);

  useEffect(() => {
    if (!weather.currentForecast && weather.status === 'idle') {
      dispatch(fetchWeatherForCurrentLocation());
    }
  }, [dispatch, weather.currentForecast, weather.status]);

  const theme = getThemeForProvider(weather.selectedProviderId);

  let content: React.ReactNode = null;

  if (weather.status === 'loading' && !weather.currentForecast) {
    content = (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={theme.colors.accent} />
        <Text style={[styles.statusText, { color: theme.colors.mutedText }]}>Loading weather...</Text>
      </View>
    );
  } else if (weather.status === 'error' && !weather.currentForecast) {
    content = (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{weather.error ?? 'Failed to load weather'}</Text>
      </View>
    );
  } else if (weather.currentForecast) {
    content = (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <WeatherSummaryCard forecast={weather.currentForecast} />
        <DailyForecastList
          providerId={weather.currentForecast.providerId}
          days={weather.currentForecast.daily}
        />
      </ScrollView>
    );
  } else {
    content = (
      <View style={styles.centered}>
        <Text style={[styles.statusText, { color: theme.colors.mutedText }]}>Search for a location to see the weather.</Text>
      </View>
    );
  }

  return <View style={[styles.container, { backgroundColor: theme.colors.background }]}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  statusText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    color: '#f97373',
    textAlign: 'center',
  },
});
