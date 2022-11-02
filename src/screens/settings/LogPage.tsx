import { Text } from "react-native";

import { createStyles } from "../../helpers";
import SettingsScreen from "./SettingsScreen";

export default function LogPage({ navigation }) {
  const styles = useStyles();

  return (
    <SettingsScreen
      title="Focusing Log"
      onBack={() => navigation.navigate("Home")}
    >
      <Text style={styles.text}>
        You have started <Text style={{ fontWeight: "700" }}>X</Text> focusing
        sessions today.
      </Text>
      <Text style={styles.text}>
        The last focus session ended at{" "}
        <Text style={{ fontWeight: "700" }}>X</Text>.
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
