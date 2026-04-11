import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorStackParamList } from '../utils/types';
import { ScreenNames } from '../utils/screenNames';
import DoctorList from '../modules/doctor/screens/DoctorList';

const Stack = createNativeStackNavigator<DoctorStackParamList>();

const DoctorNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ScreenNames.DOCTOR_LIST} component={DoctorList} />
  </Stack.Navigator>
);

export default DoctorNavigator;
