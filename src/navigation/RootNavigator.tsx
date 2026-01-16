import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../presentation/screens/HomeScreen/HomeScreen';
import { LocationSearchScreen } from '../presentation/screens/LocationSearchScreen/LocationSearchScreen';
import { FakeSearchInput } from '../presentation/components/FakeSearchInput';
import { ProviderToggleIcon } from '../presentation/components/ProviderToggleIcon';
import { CurrentLocationHeaderButton } from '../presentation/components/CurrentLocationHeaderButton';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerTitle: () => <FakeSearchInput />,
          headerRight: () => <ProviderToggleIcon />,
        }}
      />
      <Stack.Screen
        name='LocationSearch'
        component={LocationSearchScreen}
        options={{
          headerTitle: 'Search location',
          headerLeft: () => <CurrentLocationHeaderButton />,
        }}
      />
    </Stack.Navigator>
  );
}
