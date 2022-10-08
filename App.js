import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/screens/HomePage.js';
import TimerPage from './src/screens/TimerPage.js';
import QuitPage from './src/screens/QuitPage.js';
import SuccessPage from './src/screens/SuccessPage.js';

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