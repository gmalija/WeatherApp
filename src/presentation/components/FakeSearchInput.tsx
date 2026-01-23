import React from 'react';
import {Pressable, View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTheme} from '../contexts';
import {useAppSelector} from '../state/hooks';
import type {RootStackParamList} from '../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function FakeSearchInput() {
  const {theme} = useTheme();
  const navigation = useNavigation<Navigation>();
  const selectedLocation = useAppSelector(
    state => state.app.preferences.selectedLocation,
  );
  const label = selectedLocation ? selectedLocation.name : 'Search location';

  return (
    <Pressable
      onPress={() => navigation.navigate('LocationSearch')}
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        },
      ]}>
      <View style={styles.inner}>
        <Text numberOfLines={1} style={[styles.text, {color: theme.colors.text}]}>
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
