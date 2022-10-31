import { useEffect, useState, useRef } from "react";
import { Text } from "react-native";

import { createStyles, CSSStyles, secondsToHHMMSS } from "../helpers";
import { CustomButton, Screen, ReflectionModal } from "../components";
import { saveSession, useSessionStore } from "../api";

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

  const minutes = useSessionStore((state) => state.focusDurationMinutes);
  const plan = useSessionStore((state) => state.plan);
  const saveCompletedMinutes = useSessionStore(
    (state) => state.saveCompletedMinutes
  );
  const saveGiveUpAttempt = useSessionStore((state) => state.saveGiveUpAttempt);

  const initialSeconds = minutes * 60;
  const elapsedMinutes = () => Math.ceil(elapsedSeconds / 60);

  const prompts = () => [
    `You have been focusing for ${elapsedMinutes()} minutes`,
    "Congrats! Try better next time",
  ];

  const toggleTimerAndModal = () => {
    setPaused(!paused);
    setModal(!modal);
  };

  const onBackToFocus = (answers: string[]) => {
    saveGiveUpAttempt(answers, false);
    toggleTimerAndModal();
  };

  const onCompleteGiveUp = (answers: string[]) => {
    saveGiveUpAttempt(answers, true);
    saveCompletedMinutes(elapsedMinutes());
    saveSession();
    navigation.navigate("HomePage");
  };

  const onComplete = () => {
    saveCompletedMinutes(minutes);
    navigation.navigate("SuccessPage");
  };

  const styles = useStyles();

  return (
    <Screen>
      <CustomButton
        styles={{ button: styles.button, text: styles.buttonText }}
        onPress={toggleTimerAndModal}
      >
        Give up
      </CustomButton>
      <Text style={styles.plan}>{plan}</Text>
      <Timer
        initialSeconds={initialSeconds}
        paused={paused}
        onPaused={(left) => setElapsedSeconds(initialSeconds - left)}
        onComplete={onComplete}
        styles={styles.timer}
      />
      <ReflectionModal
        visible={modal}
        prompts={prompts()}
        onRequestClose={toggleTimerAndModal}
        onComplete={onCompleteGiveUp}
        onBack={onBackToFocus}
      />
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
}));

export default TimerPage;
