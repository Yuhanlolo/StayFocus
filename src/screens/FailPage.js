import { Text } from "react-native";

import { CustomButton } from "../components/CustomButton";
import { Screen } from "../components/Screen";
import { createStyles } from "../helpers";
import { useLocalStore, saveSessionToFirestore } from "../store";

// When user gives up

function SuccessPage({ navigation }) {
  const minutes = Math.ceil(
    useLocalStore((state) => state.elapsedSeconds) / 60
  );
  const plan = useLocalStore((state) => state.plan);
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
        style={styles.button}
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

export default SuccessPage;
