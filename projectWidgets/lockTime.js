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

function lockTime()
{
    let today = new Date();
    let present = new Date(today);
    let time_p = JSON.stringify(present);
    hour_p = Number(time_p.substring(12,14)) + 8;
    min_p = Number(time_p.substring(15,17));
    sec_p = Number(time_p.substring(18,20));
}

export default lockTime;