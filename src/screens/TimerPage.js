import { useEffect, useState, useRef } from "react";
import { TextInput, Text, View } from "react-native";

import { createStyles, secondsToHHMMSS } from "../helpers";
import { CustomButton } from "../components/CustomButton";
import { CustomModal } from "../components/CustomModal";
import { Screen } from "../components/Screen";
import { useLocalStore } from "../store";

function Timer(props) {
  const [seconds, setSeconds] = useState(props.seconds);
  const secondsRef = useRef(null);
  secondsRef.current = seconds;

  useEffect(() => {
    if (!props.paused) {
      const interval = setInterval(() => {
        if (secondsRef.current <= 0) {
          clearInterval(interval);
          typeof props.onComplete === "function" ? props.onComplete() : null;
        } else {
          setSeconds((seconds) => seconds - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      props.onPaused(seconds);
    }
  }, [props.paused]);

  const timeString = (secs, showHour) => {
    const [h, m, s] = secondsToHHMMSS(secs);
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return showHour ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  return (
    <Text style={props.style}>
      {timeString(seconds, props.seconds >= 60 * 60)}
    </Text>
  );
}

function TimerPage({ navigation }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [modal, setModal] = useState(false);
  const [input, setInput] = useState("");

  const minutes = useLocalStore((state) => state.setSeconds) / 60;
  const plan = useLocalStore((state) => state.plan);
  const saveElapsedSeconds = useLocalStore((state) => state.saveElapsedSeconds);
  const saveGiveUpAttempt = useLocalStore((state) => state.saveGiveUpAttempts);

  const initialSeconds = minutes * 60;

  const elapsedMinutes = () => Math.ceil(elapsedSeconds / 60);

  const toggleTimerAndModal = () => {
    setPaused(!paused);
    setModal(!modal);
    saveGiveUpAttempt(input, false);
  };

  const onPress = () => {
    setModal(false);
    saveGiveUpAttempt(input, true);
    saveElapsedSeconds(elapsedSeconds);
    navigation.navigate("FailPage");
  };

  const styles = useStyles();

  const button = (
    <CustomButton style={styles.button} onPress={toggleTimerAndModal}>
      {modal ? "Back to focus mode" : "Give up"}
    </CustomButton>
  );

  return (
    <Screen>
      {button}
      <Text style={styles.plan}>{plan}</Text>
      <Timer
        seconds={initialSeconds}
        paused={paused}
        onPaused={(left) => setElapsedSeconds(initialSeconds - left)}
        onComplete={() => navigation.navigate("SuccessPage")}
        style={styles.timer}
      />
      <CustomModal
        style={styles.modal.container}
        visible={modal}
        onRequestClose={toggleTimerAndModal}
        title="Give up now?"
        outside={button}
      >
        <Text style={styles.modal.text}>
          You have been focusing for {elapsedMinutes()} minutes. Why do you want
          to use your phone now?
        </Text>
        <TextInput
          style={styles.modal.input}
          onChangeText={setInput}
          placeholder="Type your answer here"
          placeholderTextColor={styles.modal.input.placeholderTextColor}
          value={input}
          multiline={true}
        />
        <View style={styles.modal.buttonContainer}>
          <CustomButton onPress={onPress} style={styles.modal.button}>
            Give up
          </CustomButton>
        </View>
      </CustomModal>
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  button: {
    marginTop: "10%",
    rippleColor: theme.backgroundColor,
    borderRadius: 9999,
    text: {
      fontSize: theme.fontSizes.sm,
    },
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
  modal: {
    container: {
      position: "absolute",
      bottom: "8%",
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
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      rippleColor: theme.primaryColor,
      text: {
        fontSize: theme.fontSizes.sm,
      },
    },
  },
}));

export default TimerPage;
