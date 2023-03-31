import React, {useEffect, useState, useRef} from 'react';
import {Alert, AppState, Text, View} from 'react-native';
import notifee from '@notifee/react-native';
import {useFocusEffect} from '@react-navigation/native';

import {createStyles, secondsToHHMMSS} from '../helpers';
import {CustomButton, Screen, CustomModal} from '../components';
import {
  onLeaveFocusNotification,
  notificationId,
  saveSession,
  useSessionStore,
  isLocked,
} from '../api';

const timeString = (secs: number) => {
  const [h, m, s] = secondsToHHMMSS(secs);
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
};

function TimerPage({navigation}) {
  let tag = false;
  const [paused, setPaused] = useState(false);
  const [modal, setModal] = useState(false);
  const enableNotification = useRef(true);
  const screenLocked = useRef(false);
  const dateLocked = useRef(Date.now());

  const minutes = useSessionStore(state => state.focusDurationMinutes);
  const saveCompletedMinutes = useSessionStore(
    state => state.saveCompletedMinutes,
  );
  const saveGiveUpAttempt = useSessionStore(state => state.saveGiveUpAttempt);

  const initialSeconds = minutes * 60;
  const [seconds, setSeconds] = useState(initialSeconds);
  const secondsRef = useRef(0);
  secondsRef.current = seconds;
  const elapsedMinutes = () =>
    Math.ceil((initialSeconds - secondsRef.current) / 60);

  const toggleTimerAndModal = () => {
    setPaused(!paused);
    setModal(!modal);
  };

  const onBackToFocus = () => {
    saveGiveUpAttempt(false);
    toggleTimerAndModal();
  };

  const onLeave = () => {
    saveGiveUpAttempt(true);
    saveCompletedMinutes(elapsedMinutes());
    saveSession();
    navigation.navigate('FocusEndedPage', {
      elapsedMinutes: elapsedMinutes(),
    });
  };

  const onComplete = () => {
    saveCompletedMinutes(minutes);
    navigation.navigate('SuccessPage');
  };

  useEffect(() => {
    tag = true;
  }, []);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        if (secondsRef.current <= 0) {
          clearInterval(interval);
          onComplete();
        } else {
          setSeconds(secs => secs - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  useFocusEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        const locked = await isLocked();
        if (nextAppState.match(/inactive|background/)) {
          // Either the user locks the screen or quit the app
          tag = false;
          if (locked) {
            screenLocked.current = locked;
            dateLocked.current = Date.now();
          } else {
            enableNotification.current = true;
            saveGiveUpAttempt(false);
            onLeaveFocusNotification(enableNotification);
          }
        } else if (nextAppState === 'active') {
          // Either the user unlocks the screen or return to the app
          if (screenLocked.current) {
            screenLocked.current = false;
            let secondsDelta = Math.floor(
              (Date.now() - dateLocked.current) / 1000,
            );
            // Either the focus session continues or completed
            if (secondsDelta < secondsRef.current) {
              setSeconds(secs => secs - secondsDelta);
            } else {
              onComplete();
            }
          } else {
            // If the user clicks the notification in the time limit, the
            // pending notification is cleared. Otherwise, the user clicks
            // the pending notification and so the focus session ended.
            const pending = await notifee.getTriggerNotificationIds();
            enableNotification.current = false;
            notifee.cancelNotification(notificationId);
            if (pending.includes(notificationId)) {
              enableNotification.current = false;
              notifee.cancelNotification(notificationId);
            } else {
              //
              if(tag == false)
              {
                onLeave();
              }
            }
          }
        }
      },
    );

    return () => {
      subscription.remove();
    };
  });

  const styles = useStyles();

  return (
    <Screen>
      <View style={styles.buttonContainer}>
        <CustomButton
          styles={{button: styles.button, text: styles.buttonText}}
          onPress={toggleTimerAndModal}>
          Leave focus mode
        </CustomButton>
      </View>
      <Text style={styles.plan}>Focusing</Text>
      <Text style={styles.timer}>{timeString(seconds)}</Text>
      {modal && (
        <CustomModal
          visible={true}
          onRequestClose={toggleTimerAndModal}
          title="Leaving focus mode"
          styles={styles.modal}>
          <Text style={styles.modalText}>Are you sure to leave the focus session?</Text>
          <View style={styles.modalButtonContainer}>
            <CustomButton
              onPress={onBackToFocus}
              styles={{button: styles.modalButton}}>
              Back to focus
            </CustomButton>
            <CustomButton
              onPress={onLeave}
              styles={{button: styles.modalButton}}>
              Leave
            </CustomButton>
          </View>
        </CustomModal>
      )}
    </Screen>
  );
}

const useStyles = createStyles(theme => ({
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
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
    fontWeight: '400',
    textAlign: 'center',
  },
  timer: {
    color: theme.textColor,
    fontSize: 2 * theme.fontSizes.xl,
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  modalText: {
    marginBottom: 16,
    color: theme.muteColor,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalButton: {
    borderRadius: 16,
    rippleColor: theme.primaryColor,
  },
}));

export default TimerPage;
