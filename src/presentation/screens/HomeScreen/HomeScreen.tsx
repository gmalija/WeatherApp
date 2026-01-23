import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';

import {
  useWeatherByLocation,
  useWeatherForCurrentLocation,
} from '../../hooks/useWeatherQueries';
import {useTheme} from '../../contexts';
import {useAppSelector} from '../../state/hooks';
import {WeatherSummaryCard} from '../../components/WeatherSummaryCard';
import {DailyForecastList} from '../../components/DailyForecastList';

export function HomeScreen() {
  // Get theme and provider ID from ThemeContext
  const {theme, providerId} = useTheme();

  // Get selected location from Redux
  const selectedLocation = useAppSelector(
    state => state.app.preferences.selectedLocation,
  );

  // Use the appropriate React Query hook based on whether we have a selected location
  const locationQuery = useWeatherByLocation(selectedLocation, providerId, {
    enabled: selectedLocation !== null,
  });
  const currentLocationQuery = useWeatherForCurrentLocation(providerId, {
    enabled: selectedLocation === null,
  });

  // Determine which query is active
  const activeQuery = selectedLocation ? locationQuery : currentLocationQuery;
  const {data, isLoading, isError, error, refetch, isFetching} = activeQuery;

  let content: React.ReactNode = null;

  // Initial loading state (no data yet)
  if (isLoading && !data) {
    content = (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.statusText, {color: theme.colors.mutedText}]}>
          Loading weather...
        </Text>
      </View>
    );
  } else if (isError && !data) {
    // Error state (no cached data available)
    content = (
      <View style={styles.centered}>
        <Text style={[styles.errorText, {color: theme.colors.error}]}>
          {error?.message ?? 'Failed to load weather'}
        </Text>
      </View>
    );
  } else if (data) {
    // Success state (have weather data)
    content = (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => refetch()}
            tintColor={theme.colors.accent}
          />
        }>
        <Text style={[styles.refreshHint, {color: theme.colors.mutedText}]}>
          Pull down to refresh the forecast
        </Text>
        <WeatherSummaryCard forecast={data} />
        <DailyForecastList providerId={data.providerId} days={data.daily} />
      </ScrollView>
    );
  } else {
    // Empty state (no location selected)
    content = (
      <View style={styles.centered}>
        <Text style={[styles.statusText, {color: theme.colors.mutedText}]}>
          Search for a location to see the weather.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {content}
    </View>
  );
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
