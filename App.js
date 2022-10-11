import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HomePage, FailPage, SuccessPage, TimerPage } from "./src/screens";
import { ThemeProvider } from "./src/helpers";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="TimerPage" component={TimerPage} />
            <Stack.Screen name="FailPage" component={FailPage} />
            <Stack.Screen name="SuccessPage" component={SuccessPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
