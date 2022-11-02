import { Pressable, Text, View } from "react-native";
import { LeftArrow, Screen } from "../../components";
import { createStyles } from "../../helpers";

export default function SettingsPage({ title, onBack, children }) {
  const styles = useStyles();
  return (
    <Screen styles={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable onPress={onBack}>
          <LeftArrow size={32} color={styles.button.color} />
        </Pressable>
      </View>
      <Text style={styles.title}>{title}</Text>
      {children}
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.secondaryColor,
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  button: {
    color: theme.primaryColor,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: "700",
    textAlign: "center",
    color: theme.textColor,
  },
}));
