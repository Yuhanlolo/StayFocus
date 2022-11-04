import { useState } from "react";
import { Text } from "react-native";
import DatePicker from "react-native-date-picker";

import { TimeDropdown } from "../../components";
import { createStyles } from "../../helpers";
import SettingsScreen from "./SettingsScreen";
import { saveSettings } from "../../api";

export default function SettingsPage({ navigation }) {
  const [minutes, setMinutes] = useState(25);
  const [date, setDate] = useState(new Date(2000, 1, 1, 8, 0));

  const onChangeMinutes = (action: (prevValue: number) => number) => {
    const newValue = action(minutes);
    setMinutes(newValue);
    saveSettings(newValue, date);
  };

  const styles = useStyles();

  return (
    <SettingsScreen title="Settings" onBack={() => navigation.navigate("Home")}>
      <Text style={styles.text}>
        For each day, I plan to focus for at least
      </Text>
      <TimeDropdown value={minutes} setValue={onChangeMinutes} />
      <Text style={styles.text}>I want to be reminded at</Text>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="time"
        androidVariant="nativeAndroid"
        textColor="#ffffff"
      />
    </SettingsScreen>
  );
}

const useStyles = createStyles((theme) => ({
  text: {
    width: "80%",
    marginTop: 60,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
  },
  timeText: {
    color: theme.textColor,
    fontWeight: "700",
    fontSize: theme.fontSizes.lg,
  },
}));
