import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  LoginPage,
  SignupPage,
  HomePage,
  FailPage,
  SuccessPage,
  TimerPage,
} from "./src/screens";
import { createStyles, ThemeProvider } from "./src/helpers";
import { useAppStore } from "./src/api";

const Stack = createNativeStackNavigator();

export default function App() {
  const styles = useStyles();
  const user = useAppStore((state) => state.uid);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {user ? (
                <>
                  <Stack.Screen name="HomePage" component={HomePage} />
                  <Stack.Screen name="TimerPage" component={TimerPage} />
                  <Stack.Screen name="FailPage" component={FailPage} />
                  <Stack.Screen name="SuccessPage" component={SuccessPage} />
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

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
}));
