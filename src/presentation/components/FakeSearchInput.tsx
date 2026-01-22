import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useWeather } from '../viewModels/WeatherContext';
import type { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../theme/useTheme.tsx';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function FakeSearchInput() {
  const theme = useTheme();
  const navigation = useNavigation<Navigation>();
  const { currentLocation } = useWeather();
  const label = currentLocation ? currentLocation.name : 'Search location';

  return (
    <Pressable
      onPress={() => navigation.navigate('LocationSearch')}
      style={[styles.container, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}
    >
      <View style={styles.inner}>
        <Text numberOfLines={1} style={[styles.text, { color: theme.colors.text }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 160
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
  },
});
