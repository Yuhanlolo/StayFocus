import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppState,
  BackHandler,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import notifee, { AndroidImportance } from '@notifee/react-native';

async function onDisplayNotification() {
    permit = true;
    let countDown_2 = 10;

    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'stone_fox',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });


    const intervalId = BackgroundTimer.setInterval(() => {
    if(countDown_2 == 0)
    {
      countDown_2 = 0;
      BackgroundTimer.clearInterval(intervalId);
      if(display == true && on == true && permit == true)
      {
      notifee.displayNotification({
      id: 'stone_fox',
      title: '<b>Stay Focused</b>',
      body: "The focus mode has ended.",
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher', 

        pressAction: {
          id: 'default',
        },
      },
    });}
    }
    else
    {
      countDown_2 = countDown_2 - 1;
      if(back == false && on == true && permit == true){
      notifee.displayNotification({
      id: 'stone_fox',
      title: '<b>Stay Focused</b>',
      body: "The focus mode will end in " + countDown_2.toString() + " seconds. Click here back to StayFocused",
      android: {
        channelId,
        smallIcon: 'ic_launcher', 
        importance: AndroidImportance.HIGH,

        pressAction: {
          id: 'default',
        },
      },
    });}
    }
    },
    1000);
    return intervalId;
  }

  export default onDisplayNotification;