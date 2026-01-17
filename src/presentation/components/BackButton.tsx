import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';

import type { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../theme/useTheme.tsx';

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  'LocationSearch'
>;

export function BackButton() {
  const navigation = useNavigation<Navigation>();
  const theme = useTheme();

  const onPress = () => {
    navigation.goBack();
  };

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <ArrowLeft color={theme.colors.text} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  }
});
