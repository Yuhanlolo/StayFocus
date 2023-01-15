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

function calcuTimestamp()
{
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = (date.getMonth()+1).toString();
    let day = date.getDate().toString();
    let hour =  date.getHours().toString();
    let minute = date.getMinutes().toString();
    let second =   date.getSeconds().toString();

    if(Number(hour) <= 9)
    {
      hour = '0'+hour;
    }
    if(Number(minute) <= 9)
    {
      minute = '0'+minute;
    }
    if(Number(second) <= 9 )
    {
      second = '0'+second;
    }

    let timestamp = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

    return timestamp;
}
export default calcuTimestamp;