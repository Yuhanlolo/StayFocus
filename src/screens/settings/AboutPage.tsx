import { Text } from "react-native";

import SettingsScreen from "./SettingsScreen";

export default function AboutPage({ navigation }) {
  return (
    <SettingsScreen title="LogPage" onBack={() => navigation.navigate("Home")}>
      <Text>Instruction</Text>
      <Text>Privacy and Data Collection</Text>
    </SettingsScreen>
  );
}
