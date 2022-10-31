import { useEffect, useState, useRef } from "react";
import { TextInput, Text, View } from "react-native";

import { createStyles, CSSStyles, secondsToHHMMSS } from "../helpers";
import { CustomButton, CustomModal, Screen } from "../components";
import { useSessionStore } from "../api";

interface TimerProps {
  initialSeconds: number;
  paused: boolean;
  onComplete?: () => void;
  onPaused: (seconds: number) => void;
  styles: CSSStyles;
}

function Timer({
  initialSeconds,
  paused,
  onComplete,
  onPaused,
  styles,
}: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const secondsRef = useRef(null);
  secondsRef.current = seconds;

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        if (secondsRef.current <= 0) {
          clearInterval(interval);
          if (typeof onComplete === "function") onComplete();
        } else {
          setSeconds((seconds) => seconds - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      onPaused(seconds);
    }
  }, [paused]);

  const timeString = (secs: number) => {
    const [h, m, s] = secondsToHHMMSS(secs);
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  return <Text style={styles}>{timeString(seconds)}</Text>;
}

function TimerPage({ navigation }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [modal, setModal] = useState(false);
  const [input, setInput] = useState("");

  const minutes = useSessionStore((state) => state.focusDurationMinutes);
  const plan = useSessionStore((state) => state.plan);
  const saveCompletedMinutes = useSessionStore(
    (state) => state.saveCompletedMinutes
  );
  const saveGiveUpAttempt = useSessionStore((state) => state.saveGiveUpAttempt);

  const initialSeconds = minutes * 60;

  const elapsedMinutes = () => Math.ceil(elapsedSeconds / 60);

  const toggleTimerAndModal = () => {
    setPaused(!paused);
    setModal(!modal);
    saveGiveUpAttempt([input], false);
  };

  const onPress = () => {
    setModal(false);
    saveGiveUpAttempt([input], true);
    saveCompletedMinutes(elapsedSeconds);
    navigation.navigate("FailPage");
  };

  const onComplete = () => {
    saveCompletedMinutes(minutes);
    navigation.navigate("SuccessPage");
  };

  const styles = useStyles();

  return (
    <Screen>
      {modal || (
        <CustomButton
          styles={{ button: styles.button, text: styles.buttonText }}
          onPress={toggleTimerAndModal}
        >
          Give up
        </CustomButton>
      )}
      <Text style={styles.plan}>{plan}</Text>
      <Timer
        initialSeconds={initialSeconds}
        paused={paused}
        onPaused={(left) => setElapsedSeconds(initialSeconds - left)}
        onComplete={onComplete}
        styles={styles.timer}
      />
      <CustomModal
        style={styles.modalContainer}
        visible={modal}
        onRequestClose={toggleTimerAndModal}
        title="Give up now?"
      >
        <Text style={styles.modalText}>
          You have been focusing for {elapsedMinutes()} minutes. Why do you want
          to use your phone now?
        </Text>
        <TextInput
          style={styles.modalInput}
          onChangeText={setInput}
          placeholder="Type your answer here"
          placeholderTextColor={styles.modalInput.placeholderTextColor}
          value={input}
          multiline={true}
        />
        <View style={styles.modalButtons}>
          <CustomButton
            styles={{
              button: styles.modalButton,
              text: styles.modalButtonText,
            }}
            onPress={toggleTimerAndModal}
          >
            Back to focus
          </CustomButton>
          <CustomButton
            styles={{
              button: styles.modalButton,
              text: styles.modalButtonText,
            }}
            onPress={onPress}
          >
            Next question
          </CustomButton>
        </View>
      </CustomModal>
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  button: {
    marginTop: "10%",
    borderRadius: 9999,
    rippleColor: theme.backgroundColor,
  },
  buttonText: {
    fontSize: theme.fontSizes.sm,
  },
  plan: {
    marginTop: "25%",
    marginBottom: 8,
    width: "100%",
    color: theme.textColor,
    fontSize: theme.fontSizes.lg,
    fontWeight: "400",
    textAlign: "center",
  },
  timer: {
    width: "100%",
    color: theme.textColor,
    fontSize: 2 * theme.fontSizes.xl,
    textAlign: "center",
  },
  modalContainer: {
    position: "absolute",
    bottom: "8%",
  },
  modalText: {
    marginBottom: 16,
    color: theme.muteColor,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
  },
  modalInput: {
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalButton: {
    rippleColor: theme.primaryColor,
  },
  modalButtonText: {
    fontSize: theme.fontSizes.xs,
  },
}));

export default TimerPage;
