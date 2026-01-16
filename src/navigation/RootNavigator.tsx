import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../presentation/screens/HomeScreen/HomeScreen';
import { LocationSearchScreen } from '../presentation/screens/LocationSearchScreen/LocationSearchScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          title: 'Weather',
        }}
      />
      <Stack.Screen
        name='LocationSearch'
        component={LocationSearchScreen}
        options={{
          title: 'Search location',
        }}
      />
    </Stack.Navigator>
  );
}
