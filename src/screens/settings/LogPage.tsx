import React, { useState } from "react";
import { Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getLastSessionEndTime, getSessionsCountToday } from "../../api";

import { createStyles } from "../../helpers";
import SettingsScreen from "./SettingsScreen";

export default function LogPage({ navigation }) {
  const styles = useStyles();
  const [count, setCount] = useState(0);
  const [endTime, setEndTime] = useState("");

  // Changing a screen does not necessarily mean componentWillUnmount
  // will be called, so if user returns to HomePage then go back to
  // LogPage, the useEffect callback will not run, since LogPage has
  // never been unmounted to be mounted again. The useFocusEffect hook
  // is made for this exact scenario, running the callback whenever the
  // screen is focused.
  // See https://reactnavigation.org/docs/navigation-lifecycle/
  // However, a better approach is probably to save this information to
  // zustand store, then it can be updated before it is focused.
  useFocusEffect(
    React.useCallback(() => {
      async function callback() {
        const c = await getSessionsCountToday();
        setCount(c);
        const t = await getLastSessionEndTime();
        setEndTime(t);
      }

      callback();
    }, [])
  );

  return (
    <SettingsScreen
      title="Focusing Log"
      onBack={() => navigation.navigate("Home")}
    >
      <Text style={styles.text}>
        You have started <Text style={{ fontWeight: "700" }}>{count}</Text>{" "}
        focusing sessions today.
      </Text>
      <Text style={styles.text}>
        The last focus session ended at{" "}
        <Text style={{ fontWeight: "700" }}>{endTime}</Text>.
      </Text>
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
}));
