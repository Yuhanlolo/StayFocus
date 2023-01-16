import { useState } from "react";
import { Text } from "react-native";
import DatePicker from "react-native-date-picker";

import { CustomButton, TimeDropdown } from "../../components";
import { createStyles } from "../../helpers";
import SettingsScreen from "./SettingsScreen";
import { saveSettings, setReminder } from "../../api";

export default function SettingsPage({ navigation }) {
  const [minutes, setMinutes] = useState(25);
  const d = new Date();
  d.setHours(8, 0, 0, 0);
  const [date, setDate] = useState(d);
  const [saved, setSaved] = useState(false);

  const onBack = () => {
    navigation.navigate("Home");
  };

  const onConfirm = () => {
    saveSettings(minutes, date);
    setReminder(date);
    setSaved(true);
    // pretty sure this is a race condition somehow
    setTimeout(() => setSaved(false), 3000);
  };

  const styles = useStyles();

  return (
    <SettingsScreen title="Settings" onBack={onBack}>
      <Text style={styles.text}>
        For each day, I plan to focus for at least
      </Text>
      <TimeDropdown value={minutes} setValue={setMinutes} />
      <Text style={styles.text2}>I want to be reminded at</Text>
      <DatePicker
        date={date}
        onDateChange={setDate}
        mode="time"
        androidVariant="nativeAndroid"
        textColor="#ffffff"
      />
      <CustomButton
        onPress={onConfirm}
        styles={{ button: styles.button, text: styles.buttonText }}
      >
        Confirm
      </CustomButton>
      {saved && (
        <Text style={styles.textSaved}>Your settings have been saved</Text>
      )}
    </SettingsScreen>
  );
}

const useStyles = createStyles((theme) => ({
  text: {
    width: "80%",
    marginTop: 20,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
  },
  text2: {
    width: "80%",
    marginTop: 180,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: theme.primaryColor,
    rippleColor: theme.secondaryColor,
  },
  buttonText: {
    color: theme.muteColor,
    fontSize: theme.fontSizes.sm,
  },
  textSaved: {
    fontSize: theme.fontSizes.xs,
    textAlign: "center",
    marginTop: 12,
    color: theme.textColor,
  },
}));
