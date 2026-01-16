import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppSelector } from '../state/hooks';
import { getThemeForProvider } from '../theme';
import type { RootStackParamList } from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function FakeSearchInput() {
  const navigation = useNavigation<Navigation>();
  const { currentLocation, selectedProviderId } = useAppSelector((state) => state.weather);
  const theme = getThemeForProvider(selectedProviderId);

  const label = currentLocation ? currentLocation.name : 'Search location';

  return (
    <Pressable
      onPress={() => navigation.navigate('LocationSearch')}
      style={[styles.container, { borderColor: theme.colors.accent }]}
    >
      <View style={styles.inner}>
        <Text
          numberOfLines={1}
          style={[styles.text, { color: currentLocation ? theme.colors.text : theme.colors.mutedText }]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 260,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 14,
  },
});
