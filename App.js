import * as React from 'react';
import { Text, View, Button, LogBox } from 'react-native';
import { NavigationContainer,useNavigationContainerRef, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
        console.log('previousRouteName',previousRouteName);
        console.log('currentRouteName',currentRouteName);
        console.log('NameType:',typeof currentRouteName);
        if(currentRouteName == 'TimerPage')
        {
          on = true;
        }
        if(currentRouteName != 'TimerPage')
        {
          on = false;
        }
        if(currentRouteName != 'HomePage')
        {
          errorMessage = '';
        }
        if(currentRouteName != 'ReminderPage')
        {
          errorMessage_reminder = '';
        }

  //      if (previousRouteName !== currentRouteName) {
          // Replace the line below to add the tracker from a mobile analytics SDK
  //        alert(`The route changed to ${currentRouteName}`);

  //      }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}
    >
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
  );
}

export default App;