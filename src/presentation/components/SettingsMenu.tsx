import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useWeather } from '../viewModels/WeatherContext';
import { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { WeatherProviderModal } from './WeatherProviderModal';
import { Settings } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme.tsx';

export function SettingsMenu() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const weather = useWeather();

  const handleSelectProvider = async (providerId: WeatherProviderId) => {
    weather.setProviderId(providerId);

    if (weather.currentLocation) {
      await weather.fetchWeatherByLocation(weather.currentLocation);
    }

    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.iconButton}
        testID="settings-icon"
      >
        <Settings color={theme.colors.text} size={24} />
      </Pressable>

      <WeatherProviderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectProvider={handleSelectProvider}
      />
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
  }
});