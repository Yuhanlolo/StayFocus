import { View } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";

import HomePage from "./HomePage";
import SettingsPage from "./settings/SettingsPage";
import { logoutUser } from "../api";
import { createStyles } from "../helpers";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const styles = useStyles();
  return (
    <Drawer.Navigator
      useLegacyImplementation
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawer,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomePage} />
      <Drawer.Screen name="Settings" component={SettingsPage} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const styles = useStyles();
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

const useStyles = createStyles((theme) => ({
  drawer: {
    width: 200,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: theme.secondaryColor,
  },
}));
