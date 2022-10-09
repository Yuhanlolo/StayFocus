import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomModal } from "../components/CustomModal";
import { CustomButton } from "../components/CustomButton";
import { createStyles } from "../helpers";

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

  const next = () => {
    if (promptIndex < prompts.length - 1) {
      console.log(input);
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
    marginBottom: 15,
    color: "#e0e3e2",
    fontSize: theme.fontSizes.xl,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    color: "#e0e3e2",
    fontSize: theme.fontSizes.md,
    textAlign: "center",
  },
  modalInput: {
    marginBottom: 15,
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
    backgroundColor: "transparent",
    rippleColor: "transparent",
    text: {
      color: theme.secondaryColor,
      textAlign: "center",
    },
  },
}));

function SuccessPage({ route, navigation }) {
  const { minutes, plan } = route.params;
  const planLowerCase = plan[0].toLowerCase() + plan.slice(1);
  const [modal, setModal] = useState(false);

  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
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
          onBackToHome={() => navigation.navigate("HomePage")}
        />
      ) : null}
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
