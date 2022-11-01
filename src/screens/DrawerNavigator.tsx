import { View } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";

import HomePage from "./HomePage";
import { CustomButton, Screen } from "../components";
import { logoutUser } from "../api";
import { createStyles } from "../helpers";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomePage} />
      <Drawer.Screen name="Settings" component={SettingsPage} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const styles = useDrawerStyles();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View>
        <DrawerItemList {...props} />
      </View>
      <DrawerItem label="Log out" onPress={logoutUser} {...props} />
    </DrawerContentScrollView>
  );
}

const useDrawerStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: theme.secondaryColor,
  },
}));

function SettingsPage({ navigation }) {
  return (
    <Screen>
      <CustomButton onPress={() => navigation.navigate("Home")}>
        Back to home
      </CustomButton>
    </Screen>
  );
}
