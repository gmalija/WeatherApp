import React, { useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';

import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setSelectedProviderId,
  fetchWeatherByLocation,
} from '../state/weatherSlice';
import { WeatherProviderId } from '../../domain/valueObjects/WeatherProviderId';

import { WeatherProviderModal } from './WeatherProviderModal';

export function SettingsMenu() {
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
        <Text style={styles.icon}>⚙️</Text>
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
  },
  icon: {
    fontSize: 20,
  },
});