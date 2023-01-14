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
    let countDown_2 = 10;
    permission = true;

    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'fox_stone',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    const intervalId = BackgroundTimer.setInterval(() => {
    if(countDown_2 == 0)
    {
      countDown_2 = 0;
      BackgroundTimer.clearInterval(intervalId);
      if(backgroundAware == false && on == true && permission == true)
      {
      notifee.displayNotification({
      id: 'fox_stone',
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
      if(backgroundAware == false && on == true && permission == true){
      notifee.displayNotification({
      id: 'fox_stone',
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

