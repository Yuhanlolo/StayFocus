import { useState } from "react";
import { Text } from "react-native";

import { CustomButton, ReflectionModal, Screen } from "../components";
import { createStyles } from "../helpers";
import { useSessionStore, saveSessionToFirestore } from "../api";

//When finish the focusing task, this page come out for congrats.
const prompts = [
  "How productive do you think you was during the session?",
  "How do you feel without the distraction from smartphone?",
  "Any thoughts about focusing for a longer duration next time?",
  "Great job! Hope you can do better next time!",
];

function SuccessPage({ navigation }) {
  const saveReflectionAnswers = useSessionStore(
    (state) => state.saveReflectionAnswers
  );
  const minutes = useSessionStore((state) => state.focusDurationMinutes);
  const plan = useSessionStore((state) => state.plan);
  const planLowerCase = plan[0].toLowerCase() + plan.slice(1);

  const [modal, setModal] = useState(false);

  const styles = useStyles();

  return (
    <Screen>
      <Text style={styles.text}>
        Congrats! You focused on{" "}
        <Text style={{ fontStyle: "italic" }}>{planLowerCase}</Text> for{" "}
        {minutes} minutes!
      </Text>
      <CustomButton
        styles={{ button: styles.button }}
        onPress={() => setModal(true)}
      >
        Start a quick recall
      </CustomButton>
      {modal ? (
        <ReflectionModal
          visible={true}
          prompts={prompts}
          onRequestClose={() => setModal(false)}
          onComplete={(answers) => {
            saveReflectionAnswers(answers);
            saveSessionToFirestore();
            navigation.navigate("HomePage");
          }}
        />
      ) : null}
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
