import { useState } from "react";
import { Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { TimeDropdown } from "../../components";
import { createStyles, dateToHHMM } from "../../helpers";
import SettingsScreen from "./SettingsScreen";

export default function SettingsPage({ navigation }) {
  const [value, setValue] = useState(25);
  const [date, setDate] = useState(new Date(2000, 1, 1, 8, 0));
  const [show, setShow] = useState(false);

  // use {} for unused parameters, similar to _ in Rust
  // see https://github.com/Microsoft/TypeScript/issues/14154
  const onChange = ({}, selectedDate: Date) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const styles = useStyles();

  return (
    <SettingsScreen title="Settings" onBack={() => navigation.navigate("Home")}>
      <Text style={styles.text}>
        For each day, I plan to focus for at least
      </Text>
      <TimeDropdown value={value} setValue={setValue} />
      <Text style={styles.text}>I want to be reminded at</Text>
      <Pressable onPress={() => setShow(true)}>
        <Text style={styles.timeText}>{dateToHHMM(date)}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="time"
          is24Hour={true}
          onChange={onChange}
        />
      )}
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
