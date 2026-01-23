import React, {useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {useTheme} from '../contexts';
import {useInvalidateWeather} from '../hooks/useWeatherQueries';
import type {WeatherProviderId} from '../../domain/valueObjects/WeatherProviderId';
import {WeatherProviderModal} from './WeatherProviderModal';
import {Settings} from 'lucide-react-native';

export function SettingsMenu() {
  const {theme, setProviderId} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const invalidateWeather = useInvalidateWeather();

  const handleSelectProvider = (providerId: WeatherProviderId) => {
    // Update theme provider (triggers theme change)
    setProviderId(providerId);

    // Invalidate all weather queries to refetch with new provider
    invalidateWeather();

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