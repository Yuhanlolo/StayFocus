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

function timeLock()
{
    let today = new Date();
    let present = new Date(today);
    let time_p = JSON.stringify(present);
    hour_prev = Number(time_p.substring(12,14)) + 8;
    min_prev = Number(time_p.substring(15,17));
    sec_prev = Number(time_p.substring(18,20));
}

export default timeLock;