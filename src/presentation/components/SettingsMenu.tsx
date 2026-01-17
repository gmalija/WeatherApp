import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setSelectedProviderId,
  fetchWeatherByLocation,
} from '../state/weatherSlice';
import { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { WeatherProviderModal } from './WeatherProviderModal';
import { Settings } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme.tsx';

export function SettingsMenu() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const { currentLocation } = useAppSelector(state => state.weather);

  const handleSelectProvider = (providerId: WeatherProviderId) => {
    dispatch(setSelectedProviderId(providerId));

    if (currentLocation) {
      dispatch(fetchWeatherByLocation({ location: currentLocation }));
    }

    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.iconButton}
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