import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppDispatch } from '../../state/hooks';
import { fetchWeatherByLocation } from '../../state/weatherSlice';
import type { RootStackParamList } from '../../../navigation/types';
import type { Location } from '../../../domain/entities/Location';
import { weatherDependencies } from '../../../application/weatherDependencies';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;

export function LocationSearchScreen() {
  const navigation = useNavigation<Navigation>();
  const dispatch = useAppDispatch();

  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const runSearch = async (query: string, { navigateOnSingle }: { navigateOnSingle: boolean }) => {
    const trimmed = query.trim();

    if (!trimmed) {
      setError('Location is required');
      setResults([]);
      return;
    }

    setError(null);
    setIsSearching(true);

    try {
      const locations = await weatherDependencies.geocodingService.searchLocationsByName(trimmed);

      if (!locations.length) {
        setError('Location not found');
        setResults([]);
        return;
      }

      setResults(locations);

      if (navigateOnSingle && locations.length === 1) {
        dispatch(fetchWeatherByLocation({ location: locations[0] }));
        navigation.goBack();
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to find location');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async () => {
    await runSearch(value, { navigateOnSingle: true });
  };

  const onSelectLocation = (location: Location) => {
    dispatch(fetchWeatherByLocation({ location }));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Search location</Text>
        <TextInput
          value={value}
          onChangeText={(text) => {
            setValue(text);
            if (error) {
              setError(null);
            }
            if (!text.trim()) {
              setResults([]);
              return;
            }
            // Trigger a search-as-you-type experience so users see suggestions
            // like "Cartagena de Indias" when typing "Car".
            runSearch(text, { navigateOnSingle: false });
          }}
          placeholder='Madrid, España'
          keyboardType='default'
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.input}
          onSubmitEditing={onSubmit}
          returnKeyType='search'
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable onPress={onSubmit} style={styles.button}>
          <Text style={styles.buttonText}>{isSearching ? 'Searching...' : 'Search'}</Text>
        </Pressable>

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Select a location</Text>
            <FlatList
              data={results}
              keyExtractor={(item) => `${item.latitude},${item.longitude}`}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.resultItem}
                  onPress={() => onSelectLocation(item)}
                >
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultCoords}>
                    {item.latitude.toFixed(2)}, {item.longitude.toFixed(2)}
                  </Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.resultSeparator} />}
            />
          </View>
        )}
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
  resultsContainer: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#e5e7eb',
  },
  resultItem: {
    paddingVertical: 8,
  },
  resultName: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  resultCoords: {
    fontSize: 12,
    color: '#9ca3af',
  },
  resultSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#374151',
  },
});
