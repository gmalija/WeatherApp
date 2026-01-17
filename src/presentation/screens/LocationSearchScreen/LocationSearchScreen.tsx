import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppDispatch } from '../../state/hooks';
import { fetchWeatherByLocation } from '../../state/weatherSlice';
import type { RootStackParamList } from '../../../navigation/types';
import type { Location } from '../../../domain/entities/Location';
import { weatherDependencies } from '../../../application/weatherDependencies';
import { useTheme } from '../../theme/useTheme.tsx';
import { MapPin } from 'lucide-react-native';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;

export function LocationSearchScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Navigation>();
  const dispatch = useAppDispatch();

  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.colors.mutedText }]}>
          Search location
        </Text>
        <TextInput
          value={value}
          onChangeText={text => {
            setValue(text);
            if (error) {
              setError(null);
            }

            const trimmed = text.trim();

            // Clear results and cancel any pending search if input is empty or too short
            if (!trimmed || trimmed.length < 3) {
              setResults([]);
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = null;
              }
              return;
            }

            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }

            // Small debounce so we don't hit the API on every keystroke
            searchTimeoutRef.current = setTimeout(() => {
              runSearch(text, { navigateOnSingle: false });
            }, 400);
          }}
          placeholder={'Madrid, España'}
          placeholderTextColor={theme.colors.mutedText}
          keyboardType={'default'}
          autoCapitalize={'none'}
          autoCorrect={false}
          style={[styles.input, {borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.headerBackground}]}
          onSubmitEditing={onSubmit}
          returnKeyType={'search'}
        />
        {error ? <Text style={[styles.error, {color: theme.colors.error}]}>{error}</Text> : null}
        <Pressable onPress={onSubmit} style={[styles.button, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            {isSearching ? 'Searching...' : 'Search'}
          </Text>
        </Pressable>

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsTitle, {color: theme.colors.text}]}>Select a location</Text>
            <FlatList
              data={results}
              keyExtractor={item => `${item.latitude},${item.longitude}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => onSelectLocation(item)}
                >
                  <MapPin />
                  <Text style={[styles.resultName, {color: theme.colors.mutedText}]}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.resultSeparator} />
              )}
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16
  },
  error: {
    marginTop: 8,
    fontSize: 13,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 14,
    marginBottom: 8
  },
  resultItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8
  },
  resultName: {
    flex: 1,
    fontSize: 14,
  },
  resultSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#374151',
  },
});
