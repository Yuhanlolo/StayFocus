import { useEffect, useState, useRef } from "react";
import { Modal, TextInput, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles, secondsToHHMMSS } from "../helpers";
import { CustomButton } from "../components/CustomButton";

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

function TimerPage({ route, navigation }) {
  const { minutes, plan } = route.params;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [modal, setModal] = useState(false);
  const [input, setInput] = useState("");

  const initialSeconds = minutes * 60;

  const toggleTimerAndModal = () => {
    setPaused(!paused);
    setModal(!modal);
  };

  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <CustomButton style={styles.button} onPress={toggleTimerAndModal}>
        Give up
      </CustomButton>
      <Text style={styles.plan}>{plan}</Text>
      <Timer
        seconds={initialSeconds}
        paused={paused}
        onPaused={(left) => setElapsedSeconds(initialSeconds - left)}
        onComplete={() =>
          navigation.navigate("SuccessPage", { minutes: minutes, plan: plan })
        }
        style={styles.timer}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={toggleTimerAndModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHead}>Give up now?</Text>
            <Text style={styles.modalText}>
              You have been focusing for {Math.ceil(elapsedSeconds / 60)}{" "}
              minutes. Why do you want to use your phone now?
            </Text>
            <TextInput
              style={styles.modalInput}
              onChangeText={setInput}
              value={input}
              multiline={true}
            />
            <View style={styles.modalButtons}>
              <CustomButton
                onPress={toggleTimerAndModal}
                style={styles.modalButton}
              >
                Give up
              </CustomButton>
              <CustomButton
                onPress={toggleTimerAndModal}
                style={styles.modalButton}
              >
                Continue
              </CustomButton>
            </View>
          </View>
        </View>
      </Modal>
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
  button: {
    marginTop: "20%",
    rippleColor: theme.primaryColor,
    text: {
      fontSize: theme.fontSizes.md,
    },
  },
  plan: {
    marginTop: "50%",
    width: "100%",
    color: theme.muteColor,
    fontFamily: "serif",
    fontStyle: "italic",
    fontSize: theme.fontSizes.lg,
    fontWeight: "400",
    textAlign: "center",
  },
  timer: {
    width: "100%",
    color: theme.secondaryColor,
    fontWeight: "700",
    fontSize: theme.fontSizes.huge * 2.25,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.32)",
  },
  modalView: {
    margin: 24,
    backgroundColor: "#006a65",
    borderRadius: 20,
    padding: 35,
    alignItems: "stretch",
    elevation: 3,
  },
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
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    width: 90,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: "transparent",
    text: {
      color: theme.secondaryColor,
      textAlign: "right",
    },
  },
}));

export default TimerPage;
