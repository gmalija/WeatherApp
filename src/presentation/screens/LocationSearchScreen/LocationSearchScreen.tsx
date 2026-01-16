import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function LocationSearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Search</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
});
