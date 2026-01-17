import React, { useState } from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setSelectedProviderId,
  fetchWeatherByLocation,
} from '../state/weatherSlice';
import { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';
import { WeatherProviderModal } from './WeatherProviderModal';
import { Settings } from 'lucide-react-native';
import { getGeneralColors } from '../theme';

export function SettingsMenu() {
  const colorScheme = useColorScheme();
  const colors = getGeneralColors(colorScheme === 'dark');

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
        <Settings color={colors.text} size={24} />
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