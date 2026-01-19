import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';

import { useWeather } from '../../viewModels/WeatherContext';
import { WeatherSummaryCard } from '../../components/WeatherSummaryCard';
import { DailyForecastList } from '../../components/DailyForecastList';
import { useTheme } from '../../theme/useTheme.tsx';

export function HomeScreen() {
  const theme = useTheme();
  const weather = useWeather();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Reset refreshing state when loading completes
  useEffect(() => {
    if (weather.status !== 'loading' && isRefreshing) {
      setIsRefreshing(false);
    }
  }, [weather.status, isRefreshing]);

  const onRefresh = () => {
    setIsRefreshing(true);
    if (weather.currentLocation) {
      weather.fetchWeatherByLocation(weather.currentLocation);
    } else {
      weather.fetchWeatherForCurrentLocation();
    }
  };

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
        <Text
          style={[
            styles.errorText,
            { color: theme.colors.error },
          ]}
        >
          {weather.error ?? 'Failed to load weather'}
        </Text>
      </View>
    );
  } else if (weather.currentForecast) {
    content = (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
          />
        }
      >
        <Text style={[styles.refreshHint, { color: theme.colors.mutedText }]}>Pull down to refresh the forecast</Text>
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
  refreshHint: {
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
