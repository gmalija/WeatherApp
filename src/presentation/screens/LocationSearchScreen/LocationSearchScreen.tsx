import React, {useState, useRef, useCallback} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useLocationSearch} from '../../hooks/useWeatherQueries';
import {useTheme} from '../../contexts';
import {useAppDispatch} from '../../state/hooks';
import {
  setSelectedLocation,
  setLocationSearchQuery,
  clearLocationSearchForm,
} from '../../state/appSlice';
import type {RootStackParamList} from '../../../navigation/types';
import type {Location} from '../../../domain/entities/Location';
import {MapPin} from 'lucide-react-native';

type Navigation = NativeStackNavigationProp<
  RootStackParamList,
  'LocationSearch'
>;

function ResultSeparator() {
  return <View style={styles.resultSeparator} />;
}

export function LocationSearchScreen() {
  // Get theme from ThemeContext
  const {theme} = useTheme();
  const navigation = useNavigation<Navigation>();
  const dispatch = useAppDispatch();

  // Local state for search input and debouncing
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // React Query hook for location search (debounced)
  const {data: results = [], isLoading: isSearching} =
    useLocationSearch(debouncedQuery);

  // Update Redux form state
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      dispatch(setLocationSearchQuery(text));

      // Clear local error
      if (localError) {
        setLocalError(null);
      }

      const trimmed = text.trim();

      // Cancel pending search if input is too short
      if (!trimmed || trimmed.length < 3) {
        setDebouncedQuery('');
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = null;
        }
        return;
      }

      // Debounce the search query
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedQuery(trimmed);
      }, 400);
    },
    [dispatch, localError],
  );

  const onSubmit = useCallback(() => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setLocalError('Location is required');
      return;
    }

    if (!results.length) {
      setLocalError('Location not found');
      return;
    }

    // If only one result, select it automatically
    if (results.length === 1) {
      dispatch(setSelectedLocation(results[0]));
      dispatch(clearLocationSearchForm());
      navigation.goBack();
    }
  }, [searchQuery, results, dispatch, navigation]);

  const onSelectLocation = useCallback(
    (location: Location) => {
      // Update Redux with selected location
      dispatch(setSelectedLocation(location));
      dispatch(clearLocationSearchForm());
      navigation.goBack();
    },
    [dispatch, navigation],
  );

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
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder={'Madrid, España'}
          placeholderTextColor={theme.colors.mutedText}
          keyboardType={'default'}
          autoCapitalize={'none'}
          autoCorrect={false}
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.headerBackground,
            },
          ]}
          onSubmitEditing={onSubmit}
          returnKeyType={'search'}
        />
        {localError ? (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {localError}
          </Text>
        ) : null}
        <Pressable
          onPress={onSubmit}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
            {isSearching ? 'Searching...' : 'Search'}
          </Text>
        </Pressable>

        {results && results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
              Select a location
            </Text>
            <FlatList
              data={results}
              keyExtractor={item => `${item.latitude},${item.longitude}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => onSelectLocation(item)}
                >
                  <MapPin color={theme.colors.primary} size={20} />
                  <Text
                    style={[styles.resultName, { color: theme.colors.text }]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={ResultSeparator}
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
