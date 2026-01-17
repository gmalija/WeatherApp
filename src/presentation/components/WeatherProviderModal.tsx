import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useColorScheme } from 'react-native';

import {
  WeatherProviderId,
  WeatherProviderIds,
} from '../../domain/valueObjects/WeatherProviderId';
import { getThemeForProvider } from '../theme';

const providers = [
  { id: WeatherProviderIds.OPEN_METEO, label: 'Open-Meteo' },
  { id: WeatherProviderIds.METEOBLUE, label: 'MeteoBlue' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectProvider: (providerId: WeatherProviderId) => void;
};

export function WeatherProviderModal({
  visible,
  onClose,
  onSelectProvider,
}: Props) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const backgroundColor = isDarkMode ? '#020617' : '#ffffff';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.menu, { backgroundColor }]}>
          <Text style={[styles.title, { color: textColor }]}>
            Select Weather Service
          </Text>

          <FlatList
            data={providers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const theme = getThemeForProvider(item.id);

              return (
                <Pressable
                  onPress={() => onSelectProvider(item.id)}
                  style={[
                    styles.menuItem,
                    { backgroundColor: theme.colors.accent },
                  ]}
                >
                  <Text style={[styles.menuText, { color: theme.colors.text }]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: '80%',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuItem: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    textAlign: 'center',
  },
});