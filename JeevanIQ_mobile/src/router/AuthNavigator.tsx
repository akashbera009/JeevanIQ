import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../utils/types';
import { ScreenNames } from '../utils/screenNames';
import {
  SplashScreen,
  LoginScreen,
  LocationPermissionScreen,
  VerificationModal,
} from '../modules/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.SPLASH}
      screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name={ScreenNames.SPLASH} component={SplashScreen} />
      <Stack.Screen
        name={ScreenNames.LOGIN}
        component={LoginScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={ScreenNames.VERIFICATION_MODAL}
        component={VerificationModal}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={ScreenNames.LOCATION_PERMISSION}
        component={LocationPermissionScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;