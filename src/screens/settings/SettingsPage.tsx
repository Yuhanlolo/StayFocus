import { useState } from "react";
import { Text } from "react-native";
import { TimeDropdown } from "../../components";

import SettingsScreen from "./SettingsScreen";

export default function SettingsPage({ navigation }) {
  const [value, setValue] = useState(25);
  return (
    <SettingsScreen title="Settings" onBack={() => navigation.navigate("Home")}>
      <Text>For each day, I plan to focus for at least</Text>
      <TimeDropdown value={value} setValue={setValue} />
    </SettingsScreen>
  );
}
