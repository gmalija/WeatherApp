import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useWeather } from '../viewModels/WeatherContext';
import type { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../theme/useTheme.tsx';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;

export function CurrentLocationHeaderButton() {
  const theme = useTheme();
  const navigation = useNavigation<Navigation>();
  const weather = useWeather();

  const onPress = async () => {
    await weather.fetchWeatherForCurrentLocation();
    navigation.goBack();
  };

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={[styles.text, {color: theme.colors.mutedText}]}>Current location</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: 14
  },
});
