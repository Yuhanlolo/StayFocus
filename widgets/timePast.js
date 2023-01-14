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

function timeCauculator()
{
    let hour_g = 0;
    let min_g = 0;
    let sec_g = 0;
    let today_ = new Date();
    let current = new Date(today_);
    let time_c = JSON.stringify(current);
    hour_curr = Number(time_c.substring(12,14)) + 8;
    min_curr = Number(time_c.substring(15,17));
    sec_curr = Number(time_c.substring(18,20));
    console.log('now:', time_c);
    console.log('h,m,s:', hour_curr, min_curr, sec_curr);
    if(sec_curr >= sec_prev)
    {
      sec_g = sec_curr - sec_prev;
    }
    if(sec_curr < sec_prev)
    {
      sec_g = sec_curr + 60 - sec_prev;
      if(min_curr >= 1)
      {
        min_curr = min_curr - 1;
      }
      if(min_curr == 0)
      {
        min_curr = 59;
        hour_curr = hour_curr - 1;
      }
    }
    if(min_curr >= min_prev)
    {
      min_g = min_curr - min_prev;
    }
    if(min_curr < min_prev)
    {
      min_g = min_curr + 60 - min_prev;
      if(hour_curr >= 1)
      {
        hour_curr = hour_curr - 1;
      }
      if(hour_curr == 0)
      {
        hour_curr = 23;
      }
    }
    if(hour_curr >= hour_prev)
    {
      hour_g = hour_curr - hour_prev;
    }
    if(hour_curr < hour_prev)
    {
      hour_g = hour_curr + 24 - hour_prev;
    }

    let min_past = hour_g * 60 + min_g;
    let sec_past = sec_g;

    return min_past, sec_past;
}

export default timeCauculator;