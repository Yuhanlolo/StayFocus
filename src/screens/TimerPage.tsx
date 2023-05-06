/* eslint-disable */
import React, {useEffect, useState, useRef} from 'react';
import {AppState, Text, View, Image, DeviceEventEmitter, BackHandler} from 'react-native';
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

import ChatRefQuitPage from './ChatRefQuitPage';

global.notification_control = false;

const timeString = (secs: number) => {
  const [h, m, s] = secondsToHHMMSS(secs);
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
};

let chatbot_tag = true;
let chatbot_tag_check = false;

function TimerPage({navigation}) {
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

  const onLeave = () => {
    chatbot_tag = true;
    navigation.navigate('FocusEndedPage', {
      elapsedMinutes: elapsedMinutes(),
      timeString: timeString(seconds)
    });
  };

  const onComplete = () => {
    chatbot_tag = true;
    saveCompletedMinutes(minutes);
    navigation.navigate('SuccessPage');
  };

  useEffect(() => {
    if (paused == false) {
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

  useEffect(() => {
    chatbot_tag = true;
    chatbot_tag_check = false;
  }, []);

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useFocusEffect(React.useCallback(() => {	
    DeviceEventEmitter.addListener('keepFocus', () => {
      setPaused(false);
      });
  }, []));

  useFocusEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        const locked = await isLocked();
        if (nextAppState.match(/inactive|background/)) {
          // Either the user locks the screen or quit the app
          if (locked == true) {
            chatbot_tag_check = true;
            notification_control = false;
            enableNotification.current = false;
            notifee.cancelNotification(notificationId);
            screenLocked.current = true;
            dateLocked.current = Date.now();
          } else {
            chatbot_tag = false;
            enableNotification.current = true;
            saveGiveUpAttempt(false);
            onLeaveFocusNotification(enableNotification);
          }
        } else if (nextAppState === 'active') {
          // Either the user unlocks the screen or return to the app
          chatbot_tag_check = false;
          notification_control = false;
          if (screenLocked.current == true || enableNotification.current == false) {
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

            if (pending.includes(notificationId)) {
              enableNotification.current = false;
              notifee.cancelNotification(notificationId);
            } else {
              enableNotification.current = false;
              notifee.cancelNotification(notificationId);
              if(chatbot_tag === false && chatbot_tag_check === false)
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
          onPress={()=>{setPaused(true); navigation.navigate('ChatRefQuitPage', {timeString: timeString(seconds)})}}>
          Leave focus mode
        </CustomButton>
      </View>
      <View style = {styles.bubble}>
        <Text style={styles.plan}>There are</Text>
        <Text style={styles.timer}>{timeString(seconds)}</Text>
        <Text style={styles.plan}>left in the session</Text>
      </View>
      <View style = {styles.arrow}/>
      <Image source={require('../../assets/home_page.png')} style = {styles.image} resizeMode = 'contain'/>
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
    marginTop: 25,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: theme.fontSizes.lg,
    fontWeight: '400',
    textAlign: 'center',
  },
  timer: {
    color: theme.textColor,
    fontSize: 1.5 * theme.fontSizes.xl,
    textAlign: 'center',
  },
  bubble: {
    flexDirection: 'column',
    backgroundColor: '#506F4C',
    alignItems: "center",
    paddingHorizontal: 10,
    top: '15%',
    height: '35%',
    width: '90%',
    borderRadius: 25,
    borderWidth: 7,
    borderColor: '#506F4C',
  },
  image: {
    top: '15%',
    height: '18%',
    width: '100%',
    left: '25%',
  },
  arrow: {
    top: '15%',
    left: '25%',
    width: 30,
    height: 30,
    borderWidth: 20,
    borderTopColor: '#506F4C',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
},
}));

export default TimerPage;
