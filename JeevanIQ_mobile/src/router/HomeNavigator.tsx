import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../utils/types';
import { ScreenNames } from '../utils/screenNames';
import HomeScreen from '../modules/home/screens/Home';
import DashboardScreen from '../modules/dashboard/screens/Dashboard';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ScreenNames.HOME} component={HomeScreen} />
    <Stack.Screen name={ScreenNames.DASHBOARD} component={DashboardScreen} />
  </Stack.Navigator>
);

export default HomeNavigator;