import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './HomePage';
import TimerPage from './TimerPage';
import QuitPage from './QuitPage';
import SuccessPage from './SuccessPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="TimerPage" component={TimerPage} />
        <Stack.Screen name="QuitPage" component={QuitPage} />
        <Stack.Screen name="SuccessPage" component={SuccessPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}