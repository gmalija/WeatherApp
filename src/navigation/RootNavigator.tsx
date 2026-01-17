import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

import { HomeScreen } from '../presentation/screens/HomeScreen/HomeScreen';
import { LocationSearchScreen } from '../presentation/screens/LocationSearchScreen/LocationSearchScreen';
import { FakeSearchInput } from '../presentation/components/FakeSearchInput';
import { CurrentLocationHeaderButton } from '../presentation/components/CurrentLocationHeaderButton';
import { RootStackParamList } from './types';
import { SettingsMenu } from '../presentation/components/SettingsMenu.tsx';
import { getGeneralColors } from '../presentation/theme';
import { BackButton } from '../presentation/components/BackButton.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const colorScheme = useColorScheme();
  const colors = getGeneralColors(colorScheme === 'dark');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.headerBackground,
        },
        headerTintColor: colors.headerText,
        headerTitleStyle: {
          color: colors.headerText,
        },
        contentStyle: {
          backgroundColor: colors.headerBackground,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: '',
          headerLeft: () => <FakeSearchInput />,
          headerRight: () => <SettingsMenu />,
        }}
      />
      <Stack.Screen
        name="LocationSearch"
        component={LocationSearchScreen}
        options={{
          headerTitle: '',
          headerLeft: () => <BackButton />,
          headerRight: () => <CurrentLocationHeaderButton />,
        }}
      />
    </Stack.Navigator>
  );
}