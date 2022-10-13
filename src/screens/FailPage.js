import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "../components/CustomButton";
import { createStyles } from "../helpers";
import { useLocalStore, saveSessionToFirestore } from "../store";

// When user gives up

function SuccessPage({ route, navigation }) {
  const minutes = useLocalStore((state) => state.setTimeSeconds) / 60;
  const plan = useLocalStore((state) => state.plan);
  const planLowerCase = plan[0].toLowerCase() + plan.slice(1);

  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const useStyles = createStyles((theme) => ({
  container: {
    alignItems: "center",
    height: "100%",
    padding: theme.padding,
    backgroundColor: theme.primaryColor,
  },
  text: {
    marginTop: "70%",
    marginBottom: "30%",
    color: theme.secondaryColor,
    fontFamily: "serif",
    fontSize: theme.fontSizes.xl,
    textAlign: "center",
  },
  button: {
    rippleColor: theme.primaryColor,
  },
}));

export default SuccessPage;
