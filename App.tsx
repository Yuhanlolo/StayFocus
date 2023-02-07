//import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LogBox} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import SignupPage from './src/screens/SignupPage';
import LoginPage from './src/screens/LoginPage';
import SuccessPage from './src/screens/SuccessPage';
import TimerPage from './src/screens/TimerPage';
import DrawerNavigator from './src/screens/DrawerNavigator';
import FocusEndedPage from './src/screens/FocusEndedPage';
import SetTimePage from './src/screens/SetTimePage';
import ChatRefQuitPage from './src/screens/ChatRefQuitPage';
import ChatRefFinishPage from './src/screens/ChatRefFinishPage';
import {createStyles, ThemeProvider} from './src/helpers';
import {useAppStore} from './src/api';

LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

export default function App() {
  const styles = useStyles();
  const user = useAppStore(state => state.uid);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              {user ? (
                <>
                  <Stack.Screen name="HomePage" component={DrawerNavigator} />
                  <Stack.Screen name="TimerPage" component={TimerPage} />
                  <Stack.Screen name="SuccessPage" component={SuccessPage} />
                  <Stack.Screen
                    name="FocusEndedPage"
                    component={FocusEndedPage}
                  />
                  <Stack.Screen name="SetTimePage" component={SetTimePage} />
                  <Stack.Screen name="ChatRefQuitPage" component={ChatRefQuitPage} />
                  <Stack.Screen name="ChatRefFinishPage" component={ChatRefFinishPage} />
                </>
              ) : (
                <>
                  <Stack.Screen name="LoginPage" component={LoginPage} />
                  <Stack.Screen name="SignupPage" component={SignupPage} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const useStyles = createStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
}));
