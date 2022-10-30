import * as React from 'react';
import { Text, View, Button, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {connect} from 'react-redux';
import HomePage from './Pages/HomePage';
import TimerPage from './Pages/TimerPage';
import QuitPage from './Pages/QuitPage';
import SuccessPage from './Pages/SuccessPage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import AboutPage from './Pages/AboutPage';
import ReminderPage from './Pages/ReminderPage';
import ControlPanel from './Pages/ControlPanel';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs();

 function App() {
  return (
  <MenuProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="SignUpPage" component={SignUpPage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="TimerPage" component={TimerPage} />
        <Stack.Screen name="QuitPage" component={QuitPage} />
        <Stack.Screen name="SuccessPage" component={SuccessPage} />
        <Stack.Screen name="ReminderPage" component={ReminderPage} />
        <Stack.Screen name="AboutPage" component={AboutPage} />
        <Stack.Screen name="ControlPanel" component={ControlPanel} />
      </Stack.Navigator>
    </NavigationContainer>
  </MenuProvider>
  );
}

export default App;