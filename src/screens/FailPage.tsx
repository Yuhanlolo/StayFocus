import { Text } from "react-native";

import { CustomButton } from "../components/CustomButton";
import { Screen } from "../components/Screen";
import { createStyles } from "../helpers";
import { useSessionStore, saveSessionToFirestore } from "../api";

// When user gives up

function FailPage({ navigation }) {
  const minutes = useSessionStore((state) => state.completedMinutes);
  const plan = useSessionStore((state) => state.plan);
  const planLowerCase = plan[0].toLowerCase() + plan.slice(1);

  const styles = useStyles();

  return (
    <Screen>
      <Text style={styles.text}>
        You focused on{" "}
        <Text style={{ fontStyle: "italic" }}>{planLowerCase}</Text> for{" "}
        {minutes} minutes!
      </Text>
      <CustomButton
        styles={{ button: styles.button }}
        onPress={() => {
          saveSessionToFirestore();
          navigation.navigate("HomePage");
        }}
      >
        Back to home
      </CustomButton>
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  text: {
    marginTop: "70%",
    marginBottom: "10%",
    color: theme.textColor,
    fontSize: theme.fontSizes.lg,
    textAlign: "center",
  },
  button: {
    rippleColor: theme.backgroundColor,
  },
}));

export default FailPage;
