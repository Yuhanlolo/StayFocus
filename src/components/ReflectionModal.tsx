import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { createStyles } from "../helpers";
import { CustomModal } from "../components/CustomModal";
import { CustomButton } from "../components/CustomButton";

interface ReflectionModalProps {
  visible: boolean;
  prompts: string[];
  onRequestClose: () => void;
  onBack?: (answers: string[]) => void;
  onComplete: (answers: string[]) => void;
}

export function ReflectionModal({
  visible,
  prompts,
  onBack,
  onRequestClose,
  onComplete,
}: ReflectionModalProps) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState([]);

  const addAnswer = (ans: string) => setAnswers([...answers, ans]);

  const next = () => {
    if (promptIndex < prompts.length - 1) {
      addAnswer(input);
      setInput("");
      setPromptIndex(promptIndex + 1);
    } else if (promptIndex === prompts.length - 1) {
      onComplete(answers);
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
    <CustomModal
      style={styles.container}
      visible={visible}
      onRequestClose={onRequestClose}
      title="Quick questions"
    >
      <Text style={styles.text}>{prompts[promptIndex]}</Text>
      {promptIndex < prompts.length - 1 ? (
        <TextInput
          style={styles.input}
          onChangeText={setInput}
          value={input}
          multiline={true}
          placeholder={"Type your answer here"}
          placeholderTextColor={styles.input.placeholderTextColor}
        />
      ) : null}
      <View style={styles.buttonContainer}>
        {promptIndex < prompts.length - 1 && onBack ? (
          <CustomButton
            onPress={() => onBack(answers)}
            styles={{ button: styles.button }}
          >
            Back to focus
          </CustomButton>
        ) : null}
        <CustomButton onPress={next} styles={{ button: styles.button }}>
          {buttonText()}
        </CustomButton>
      </View>
    </CustomModal>
  );
}

const useModalStyles = createStyles((theme) => ({
  container: {
    top: "25%",
  },
  text: {
    marginBottom: 16,
    color: theme.muteColor,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    height: 100,
    padding: 12,
    borderRadius: 10,
    backgroundColor: theme.textColor,
    fontSize: theme.fontSizes.sm,
    textAlignVertical: "top",
    color: theme.muteColor,
    placeholderTextColor: theme.muteColor,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    rippleColor: theme.primaryColor,
  },
  buttonText: {
    fontSize: theme.fontSizes.sm,
  },
}));
