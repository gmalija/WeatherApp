import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTheme} from '../contexts';
import {useAppDispatch} from '../state/hooks';
import {setSelectedLocation} from '../state/appSlice';
import type {RootStackParamList} from '../../navigation/types';

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  'LocationSearch'
>;

export function CurrentLocationHeaderButton() {
  const {theme} = useTheme();
  const navigation = useNavigation<Navigation>();
  const dispatch = useAppDispatch();

  const onPress = () => {
    // Set location to null to trigger current location fetch
    dispatch(setSelectedLocation(null));
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
