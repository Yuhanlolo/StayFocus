import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

import AboutPage from './AboutPage';
import ReminderPage from './ReminderPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';

function MyDrawer() {
  return (
    <Drawer.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      drawerStyle: styles.drawer,
      drawerItemStyle: styles.drawerItem,
      drawerLabelStyle: styles.drawerLabel,
    }}
    >
      <Drawer.Screen name="HomePage" component={HomePage} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="AboutPage" component={AboutPage} />
      <Drawer.Screen name="ReminderPage" component={ReminderPage} />
    </Drawer.Navigator>
  );
}

export default MyDrawer;