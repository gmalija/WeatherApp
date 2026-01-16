import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppDispatch } from '../../state/hooks';
import { fetchWeatherByLocation } from '../../state/weatherSlice';
import { parseLocationInput } from '../../validation/locationInputValidator';
import type { RootStackParamList } from '../../../navigation/types';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;

export function LocationSearchScreen() {
  const navigation = useNavigation<Navigation>();
  const dispatch = useAppDispatch();

  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    const result = parseLocationInput(value);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);
    dispatch(fetchWeatherByLocation({ location: result.location }));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Enter coordinates</Text>
        <TextInput
          value={value}
          onChangeText={(text) => {
            setValue(text);
            if (error) {
              setError(null);
            }
          }}
          placeholder='52.52,13.41'
          keyboardType='numbers-and-punctuation'
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.input}
          onSubmitEditing={onSubmit}
          returnKeyType='search'
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable onPress={onSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#e5e7eb',
    backgroundColor: '#020617',
  },
  error: {
    marginTop: 8,
    color: '#f97373',
    fontSize: 13,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '600',
  },
});
