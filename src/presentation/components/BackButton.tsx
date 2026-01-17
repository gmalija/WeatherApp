import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';

import type { RootStackParamList } from '../../navigation/types';
import { getGeneralColors } from '../theme';
import { useColorScheme } from 'react-native';

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  'LocationSearch'
>;

export function BackButton() {
  const navigation = useNavigation<Navigation>();
  const colorScheme = useColorScheme();
  const colors = getGeneralColors(colorScheme === 'dark');

  const onPress = () => {
    navigation.goBack();
  };

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <ArrowLeft color={colors.text} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  }
});
