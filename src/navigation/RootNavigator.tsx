import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../presentation/screens/HomeScreen/HomeScreen';
import { LocationSearchScreen } from '../presentation/screens/LocationSearchScreen/LocationSearchScreen';
import { FakeSearchInput } from '../presentation/components/FakeSearchInput';
import { CurrentLocationHeaderButton } from '../presentation/components/CurrentLocationHeaderButton';
import { RootStackParamList } from './types';
import { SettingsMenu } from '../presentation/components/SettingsMenu.tsx';
import { BackButton } from '../presentation/components/BackButton.tsx';
import { useTheme } from '../presentation/contexts';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleStyle: {
          color: theme.colors.headerText,
        },
        contentStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: '',
          headerLeft: FakeSearchInput,
          headerRight: SettingsMenu,
        }}
      />
      <Stack.Screen
        name="LocationSearch"
        component={LocationSearchScreen}
        options={{
          headerTitle: '',
          headerLeft: BackButton,
          headerRight: CurrentLocationHeaderButton,
        }}
      />
    </Stack.Navigator>
  );
}