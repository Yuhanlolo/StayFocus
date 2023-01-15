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

function pastTime()
{
    let hour_g = 0;
    let min_g = 0;
    let sec_g = 0;
    let today_ = new Date();
    let current = new Date(today_);
    let time_c = JSON.stringify(current);
    let hour_c = 0;
    let min_c = 0;
    let sec_c = 0;
    hour_c = Number(time_c.substring(12,14)) + 8;
    min_c = Number(time_c.substring(15,17));
    sec_c = Number(time_c.substring(18,20));
    console.log('now:', time_c);
    console.log('h,m,s:', hour_c, min_c, sec_c);
    if(sec_c >= sec_p)
    {
      sec_g = sec_c - sec_p;
    }
    if(sec_c < sec_p)
    {
      sec_g = sec_c + 60 - sec_p;
      if(min_c >= 1)
      {
        min_c = min_c - 1;
      }
      if(min_c == 0)
      {
        min_c = 59;
        hour_c = hour_c - 1;
      }
    }
    if(min_c >= min_p)
    {
      min_g = min_c - min_p;
    }
    if(min_c < min_p)
    {
      min_g = min_c + 60 - min_p;
      if(hour_c >= 1)
      {
        hour_c = hour_c - 1;
      }
      if(hour_c == 0)
      {
        hour_c = 23;
      }
    }
    if(hour_c >= hour_p)
    {
      hour_g = hour_c - hour_p;
    }
    if(hour_c < hour_p)
    {
      hour_g = hour_c + 24 - hour_p;
    }

    let min_past = hour_g * 60 + min_g;
    let sec_past = sec_g;

    return min_past, sec_past;
}

export default pastTime;
