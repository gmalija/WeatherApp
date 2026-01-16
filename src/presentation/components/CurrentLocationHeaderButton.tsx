import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppDispatch } from '../state/hooks';
import { fetchWeatherForCurrentLocation } from '../state/weatherSlice';
import type { RootStackParamList } from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;

export function CurrentLocationHeaderButton() {
  const navigation = useNavigation<Navigation>();
  const dispatch = useAppDispatch();

  const onPress = () => {
    dispatch(fetchWeatherForCurrentLocation());
    navigation.goBack();
  };

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>Current location</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: 14,
    color: '#2563eb',
  },
});
