import {View} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';

import HomePage from './HomePage';
import {AboutPage, LogPage, SettingsPage} from './settings';
import {logoutUser} from '../api';
import {createStyles} from '../helpers';

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
        drawerItemStyle: styles.drawerItem,
        drawerLabelStyle: styles.drawerLabel,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={HomePage}
        options={{drawerItemStyle: {display: 'none'}}}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsPage}
        options={{drawerLabel: 'My plan'}}
      />
      <Drawer.Screen name="Log" component={LogPage} />
      <Drawer.Screen name="About" component={AboutPage} />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const styles = useStyles();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <View>
        <DrawerItemList {...props} />
      </View>
      <DrawerItem
        label="Log out"
        onPress={logoutUser}
        {...props}
        style={styles.drawerItem}
        labelStyle={styles.drawerLabel}
      />
    </DrawerContentScrollView>
  );
}

const useStyles = createStyles(theme => ({
  drawer: {
    width: 200,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.secondaryColor,
  },
  drawerItem: {
    width: '100%',
  },
  drawerLabel: {
    color: theme.textColor,
    textAlign: 'center',
    fontSize: theme.fontSizes.md,
    fontWeight: '300',
    paddingBottom: 4,
    borderBottomColor: theme.primaryColor,
    borderBottomWidth: 1,
  },
}));
