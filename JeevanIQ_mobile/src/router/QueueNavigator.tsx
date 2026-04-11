import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueueStackParamList } from '../utils/types';
import { ScreenNames } from '../utils/screenNames';
import QueueList from '../modules/queue/screens/QueueList';

const Stack = createNativeStackNavigator<QueueStackParamList>();

const QueueNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ScreenNames.QUEUE_LIST} component={QueueList} />
  </Stack.Navigator>
);

export default QueueNavigator;
