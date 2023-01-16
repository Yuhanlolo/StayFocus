import { useEffect, useState, useRef } from "react";
import { AppState, Text, View } from "react-native";
import notifee from "@notifee/react-native";
import { useFocusEffect } from "@react-navigation/native";

import { createStyles, secondsToHHMMSS, useStrings } from "../helpers";
import { CustomButton, Screen, ReflectionModal } from "../components";
import {
  onLeaveFocusNotification,
  notificationId,
  saveSession,
  useSessionStore,
} from "../api";
import React from "react";

const timeString = (secs: number) => {
  const [h, m, s] = secondsToHHMMSS(secs);
  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
};

function TimerPage({ navigation }) {
  const [paused, setPaused] = useState(false);
  const [modal, setModal] = useState(false);
  const enableNotification = useRef(true);

  const minutes = useSessionStore((state) => state.focusDurationMinutes);
  const plan = useSessionStore((state) => state.plan);
  const saveCompletedMinutes = useSessionStore(
    (state) => state.saveCompletedMinutes
  );
  const saveGiveUpAttempt = useSessionStore((state) => state.saveGiveUpAttempt);

  const initialSeconds = minutes * 60;
  const [seconds, setSeconds] = useState(initialSeconds);
  const secondsRef = useRef(0);
  secondsRef.current = seconds;
  const elapsedMinutes = () =>
    Math.ceil((initialSeconds - secondsRef.current) / 60);

  const strings = useStrings("leaveFocusDialog", {
    focusDurationMinutes: minutes,
  });

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

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        if (secondsRef.current <= 0) {
          clearInterval(interval);
          onComplete();
        } else {
          setSeconds((seconds) => seconds - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [paused]);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = AppState.addEventListener(
        "change",
        async (nextAppState) => {
          // TODO: if the user locks the screen, then the notification is
          // also created. This might be impossible to fix, even with
          // custom native code.
          if (nextAppState.match(/inactive|background/)) {
            enableNotification.current = true;
            saveGiveUpAttempt([], false);
            onLeaveFocusNotification(enableNotification);
          } else if (nextAppState === "active") {
          /*
          If app is opened, check if the end-of-session trigger notification 
          is still pending. If yes, then the session continues; if no, then 
          the session has ended.
  
          The correct way seems to be using notifee.onBackgroundEvent() event 
          listener, but that method is super unreliable for some reasons. See 
          https://github.com/invertase/notifee/issues/404 for more details.
        */
            const pending = await notifee.getTriggerNotificationIds();
            if (pending.includes(notificationId)) {
              enableNotification.current = false;
              notifee.cancelNotification(notificationId);
            } else {
              navigation.navigate("FocusEndedPage", {
                elapsedMinutes: elapsedMinutes(),
              });
            }
          }
        }
      );

      return () => {
        subscription.remove();
      };
    }, [])
  );

  const styles = useStyles();

  return (
    <Screen>
      <View style={styles.buttonContainer}>
        <CustomButton
          styles={{ button: styles.button, text: styles.buttonText }}
          onPress={toggleTimerAndModal}
        >
          Leave focus mode
        </CustomButton>
      </View>
      <Text style={styles.plan}>{plan}</Text>
      <Text style={styles.timer}>{timeString(seconds)}</Text>
      {modal && (
        <ReflectionModal
          visible={true}
          title={strings.dialogTitle}
          prompts={strings.questions.concat([strings.finalMessage])}
          onRequestClose={toggleTimerAndModal}
          onComplete={onCompleteGiveUp}
          onBack={onBackToFocus}
          styles={styles.modal}
        />
      )}
    </Screen>
  );
}

const useStyles = createStyles((theme) => ({
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
  },
  button: {
    borderRadius: 16,
    rippleColor: theme.backgroundColor,
  },
  buttonText: {
    fontSize: theme.fontSizes.sm,
  },
  plan: {
    marginTop: 160,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.lg,
    fontWeight: "400",
    textAlign: "center",
  },
  timer: {
    color: theme.textColor,
    fontSize: 2 * theme.fontSizes.xl,
    textAlign: "center",
  },
  modal: {
    justifyContent: "flex-end",
    paddingBottom: 60,
  },
}));

export default TimerPage;
