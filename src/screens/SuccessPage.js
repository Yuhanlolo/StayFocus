import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { CustomModal } from "../components/CustomModal";
import { CustomButton } from "../components/CustomButton";
import { Screen } from "../components/Screen";
import { createStyles } from "../helpers";
import { useLocalStore, saveSessionToFirestore } from "../store";

//When finish the focusing task, this page come out for congrats.
const prompts = [
  "How productive do you think you was during the session?",
  "How do you feel without the distraction from smartphone?",
  "Any thoughts about focusing for a longer duration next time?",
  "Great job! Hope you can do better next time!",
];

function ReflectionModal({ onRequestClose, onBackToHome }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [input, setInput] = useState("");

  const saveReflectionAnswer = useLocalStore(
    (state) => state.saveReflectionAnswer
  );

  const next = () => {
    if (promptIndex < prompts.length - 1) {
      saveReflectionAnswer(input);
      setInput("");
      setPromptIndex(promptIndex + 1);
    } else if (promptIndex === prompts.length - 1) {
      onBackToHome();
    }
  };

  const buttonText = () => {
    if (promptIndex < prompts.length - 2) {
      return "Next";
    } else if (promptIndex === prompts.length - 2) {
      return "Finish";
    } else {
      return "Back to home";
    }
  };

  const styles = useModalStyles();

  return (
    <CustomModal visible={true} onRequestClose={onRequestClose}>
      <Text style={styles.modalHead}>My session</Text>
      <Text style={styles.modalText}>{prompts[promptIndex]}</Text>
      {promptIndex < prompts.length - 1 ? (
        <TextInput
          style={styles.modalInput}
          onChangeText={setInput}
          value={input}
          multiline={true}
        />
      ) : null}
      <View style={styles.modalButtons}>
        <CustomButton onPress={next} style={styles.modalButton}>
          {buttonText()}
        </CustomButton>
      </View>
    </CustomModal>
  );
}

const useModalStyles = createStyles((theme) => ({
  modalHead: {
    marginBottom: 12,
    color: "#e0e3e2",
    fontSize: theme.fontSizes.xl,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 12,
    color: "#e0e3e2",
    fontSize: theme.fontSizes.md,
    textAlign: "center",
  },
  modalInput: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.primaryColor,
    fontSize: theme.fontSizes.md,
    textAlignVertical: "top",
    color: "#e0e3e2",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    width: "100%",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent",
    rippleColor: "transparent",
    text: {
      color: theme.secondaryColor,
      textAlign: "center",
    },
  },
}));

function SuccessPage({ navigation }) {
  const minutes = useLocalStore((state) => state.setTimeSeconds) / 60;
  const plan = useLocalStore((state) => state.plan);
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
      <CustomButton style={styles.button} onPress={() => setModal(true)}>
        Start a quick recall
      </CustomButton>
      {modal ? (
        <ReflectionModal
          onRequestClose={() => setModal(false)}
          onBackToHome={() => {
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
