import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../utils/types';
import { ScreenNames } from '../utils/screenNames';
import ProfileScreen from '../modules/profile/screens/Profile';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ScreenNames.PROFILE} component={ProfileScreen} />
  </Stack.Navigator>
);

export default ProfileNavigator;
