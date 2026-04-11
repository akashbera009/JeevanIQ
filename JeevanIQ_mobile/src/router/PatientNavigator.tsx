import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PatientStackParamList } from '../utils/types';
import { ScreenNames } from '../utils/screenNames';
import PatientList from '../modules/patient/screens/PatientList';

const Stack = createNativeStackNavigator<PatientStackParamList>();

const PatientNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ScreenNames.PATIENT_LIST} component={PatientList} />
  </Stack.Navigator>
);

export default PatientNavigator;
