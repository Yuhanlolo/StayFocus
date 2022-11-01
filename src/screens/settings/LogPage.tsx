import { Text } from "react-native";

import SettingsScreen from "./SettingsScreen";

export default function LogPage({ navigation }) {
  return (
    <SettingsScreen title="LogPage" onBack={() => navigation.navigate("Home")}>
      <Text>You have started X focusing sessions today.</Text>
      <Text>The last focus session ended at .</Text>
    </SettingsScreen>
  );
}
