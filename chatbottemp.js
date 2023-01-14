import * as React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer,useNavigationContainerRef, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './ChatPages/ChatHome';
import TimerPage from './ChatPages/ChatTimer';
import SuccessPage from './ChatPages/ChatCongrats';
import LoginPage from './ChatPages/ChatLogin';
import SignUpPage from './ChatPages/ChatSignup';
import AboutPage from './Pages/AboutPage';
import ReminderPage from './Pages/ReminderPage';
import ControlPanel from './ChatPages/ChatPanel';
import QuitPage from './ChatPages/ChatQuit_new';
import SetTimePage from './ChatPages/SetTimePage';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs();

global.on = false;

 function App() {

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>{
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }
      }
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        if(currentRouteName == 'TimerPage')
        {
          on = true;
        }
        if(currentRouteName != 'TimerPage')
        {
          on = false;
        }
        if(currentRouteName != 'ReminderPage')
        {
          errorMessage_reminder = '';
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="SignUpPage" component={SignUpPage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="TimerPage" component={TimerPage} />
        <Stack.Screen name="SuccessPage" component={SuccessPage} />
        <Stack.Screen name="ReminderPage" component={ReminderPage} />
        <Stack.Screen name="AboutPage" component={AboutPage} />
        <Stack.Screen name="ControlPanel" component={ControlPanel} />
        <Stack.Screen name="QuitPage" component={QuitPage} />
        <Stack.Screen name="SetTimePage" component={SetTimePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;