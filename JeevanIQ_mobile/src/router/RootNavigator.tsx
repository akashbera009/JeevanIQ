import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { ScreenNames } from '../utils/screenNames';
import { useAppSelector } from '../utils/hooks';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {isAuthenticated ? (
        <Stack.Screen name={ScreenNames.AUTH_NAVIGATOR} component={AuthNavigator} />
      ) : (
        <Stack.Screen name={ScreenNames.BOTTOM_TAB_NAVIGATOR} component={BottomTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;