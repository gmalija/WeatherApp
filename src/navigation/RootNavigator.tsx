import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

import { HomeScreen } from '../presentation/screens/HomeScreen/HomeScreen';
import { LocationSearchScreen } from '../presentation/screens/LocationSearchScreen/LocationSearchScreen';
import { FakeSearchInput } from '../presentation/components/FakeSearchInput';
import { CurrentLocationHeaderButton } from '../presentation/components/CurrentLocationHeaderButton';
import { RootStackParamList } from './types';
import { SettingsMenu } from '../presentation/components/SettingsMenu.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const headerBackground = isDarkMode ? '#020617' : '#ffffff';
  const headerTextColor = isDarkMode ? '#f9fafb' : '#111827';

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: headerBackground,
        },
        headerTintColor: headerTextColor,
        headerTitleStyle: {
          color: headerTextColor,
        },
        contentStyle: {
          backgroundColor: headerBackground,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: '',
          headerLeft: () => <FakeSearchInput />,
          headerRight: () => <SettingsMenu />
        }}
      />
      <Stack.Screen
        name="LocationSearch"
        component={LocationSearchScreen}
        options={{
          headerTitle: '',
          headerLeft: () => <CurrentLocationHeaderButton />,
        }}
      />
    </Stack.Navigator>
  );
}
