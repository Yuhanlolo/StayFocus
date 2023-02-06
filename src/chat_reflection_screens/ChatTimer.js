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

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Congrats from './ChatCongrats';
import TimeQuit from './ChatQuit_new';
import HomePage from './ChatHome';
import onDisplayNotification from '../widgets/notification';
import timePast from '../widgets/timePast';
import timeLock from '../widgets/timeLock';

global.countDownPre = 15;
global.notiId = '1';
global.controlId = '1';
global.backgroundAware = true;
global.permission = false;
global.hour_prev = -2;
global.min_prev = -2;
global.sec_prev = -2;
global.hour_curr = -2;
global.min_curr = -2;
global.sec_curr = -2;

class TimerPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
      min_1 : 0,
      min_2 : 0,
      sec_1 : 0,
      sec_2 : 0,
      userId: '',
      oneTimeId: '',
      timeSet: 0,
      minSet: 0,
      secSet: 0,
      pause: true,
      onLock: 'unk',
      };
      }

    backAction = () => {
      return true;
   };

    _handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
          display = false;
        }
    }

    setter()
    {
      let id = this.props.route.params.userId;
      this.setState({userId: id});
      let item = this.props.route.params.oneTimeId;
      this.setState({oneTimeId: item});
      let time = this.props.route.params.timeSet;
      this.setState({timeSet: time});
      let min = this.props.route.params.minSet;
      this.setState({minSet: min});
      this.setState({min_1: Math.floor(min/10)});
      this.setState({min_2: min-Math.floor(min/10)*10});
      let sec = this.props.route.params.secSet;
      this.setState({secSet: sec});
      this.setState({sec_1: Math.floor(sec/10)});
      this.setState({sec_2: sec-Math.floor(sec/10)*10});
    }

    _handleAppStateChange = (nextAppState) => {
      BackgroundTimer.clearInterval(controlId);
      BackgroundTimer.clearInterval(notiId);

      if (nextAppState === 'background') {
        countDownPre = 15;
        backgroundAware = false;

      controlId = BackgroundTimer.setInterval(() => {
      if(countDownPre > 0)
      {
        countDownPre = countDownPre - 1;
        if(countDownPre > 10)
        {
          if(countDownPre == 14)
          {
            timeLock();
          }
          NativeModules.LockDetectionModule.getScreenStatus().then((map)=> {
            this.setState({onLock:map['flag']}, ()=>{console.log('status: ',this.state.onLock);
              }
            );
          }, (code, message)=> {});
        }
        if(countDownPre == 10)
        {
          NativeModules.LockDetectionModule.getScreenStatus().then((map)=> {
            this.setState({onLock:map['flag']}, ()=>{console.log('status: ',this.state.onLock);

              if(backgroundAware == false && on == true && this.state.onLock=='false')
              {
                this.setState({pause: false});
                console.log('out of control');
                notiId = onDisplayNotification();
              }
            }
            );
          }, (code, message)=> {});
        }
      }
      if(countDownPre == 0)
      {
        countDownPre = 0;
        BackgroundTimer.clearInterval(controlId);
        BackgroundTimer.clearInterval(notiId);
      }
      },
      1100);
      }
      if (nextAppState === 'active')
        {
          this.setState({pause: true});
          backgroundAware = true;
          permission = false;
          if(countDownPre == 0 && this.state.onLock=='false')
          {
            this.props.navigation.navigate('HomePage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId});
            countDownPre = 15;
            //database
          }
           BackgroundTimer.clearInterval(controlId);
           BackgroundTimer.clearInterval(notiId);
        }
  }

    componentDidMount()
    {
      this.setter();
      this.countDownTimer();
      AppState.addEventListener('change', this._handleAppStateChange);
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
      this.listener = DeviceEventEmitter.addListener('changeResult', () => {
        this.setState({ pause: true });
         });
    }

    componentWillUnmount() {
      this.backHandler.remove();
    }

    countDownTimer()
    {
       this.interval = setInterval(() => {

        if(this.state.min_1==0 && this.state.min_2==0 && this.state.sec_1==0 && this.state.sec_2==0)
        {
          this.setState({sec_2:0});
          this.setState({sec_1:0});
          this.setState({min_2:0});
          this.setState({min_1:0});
          this.interval && clearInterval(this.interval);
          this.props.navigation.navigate('SuccessPage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId, timeSet: this.state.timeSet});
        }

        if(this.state.pause == false)
        {
          this.setState({sec_2:this.state.sec_2});
          this.setState({sec_1:this.state.sec_1});
          this.setState({min_2:this.state.min_2});
          this.setState({min_1:this.state.min_1});
        }

        if(this.state.onLock == 'true')
        {
          this.setState({onLock: 'unk'});

          let min_past = 0;
          let sec_past = 0;

          min_past, sec_past = timePast();

          let min_pre = this.state.min_1 * 10 + this.state.min_2;
          let sec_pre = this.state.sec_1 * 10 + this.state.sec_2;

          if(min_past * 60 + sec_past >= min_pre * 60 + sec_pre)
          {
              this.setState({sec_2:0});
              this.setState({sec_1:0});
              this.setState({min_2:0});
              this.setState({min_1:0});
              this.interval && clearInterval(this.interval);
              this.props.navigation.navigate('SuccessPage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId, timeSet: this.state.timeSet});
          }

          if(min_past * 60 + sec_past < min_pre * 60 + sec_pre)
          {
          if(sec_pre >= sec_past)
          {
            this.setState({sec_2: (sec_pre - sec_past) - 10*Math.floor((sec_pre - sec_past)/10)});
            this.setState({sec_1: Math.floor((sec_pre - sec_past)/10)});
          }
          if(sec_pre < sec_past)
          {
            min_pre = min_pre - 1;
            this.setState({sec_2: (sec_pre + 60 - sec_past) - 10*Math.floor((sec_pre + 60 - sec_past)/10)});
            this.setState({sec_1: Math.floor((sec_pre + 60 - sec_past)/10)});
          }

          this.setState({min_2: (min_pre - min_past) - 10*Math.floor((min_pre - min_past)/10)});
          this.setState({min_1: Math.floor((min_pre - min_past)/10)});
          }
        }

        if(this.state.onLock != 'true' &&  this.state.pause == true && !(this.state.min_1==0 && this.state.min_2==0 && this.state.sec_1==0 && this.state.sec_2==0))
        {
          this.setState({set: true});
          this.setState({sec_2:this.state.sec_2-1});
          if(this.state.sec_2 == -1)
          {
            this.setState({sec_2:9});
            this.setState({sec_1:this.state.sec_1-1})
            if(this.state.sec_1 == -1)
            {
              this.setState({sec_1:5});
              this.setState({min_2:this.state.min_2-1});
              if(this.state.min_2 == -1)
              {
                this.setState({min_2:9});
                this.setState({min_1:this.state.min_1-1});
              }
            }
          }
        }
       }, 1000);
    }

    render() {
      return (
        <View style = {styles.background}>
           <TouchableOpacity style = {styles.button}
           onPress = {() => {
            this.setState({pause: false});
            this.props.navigation.navigate('QuitPage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId, timeSet: this.state.timeSet, minSet: this.state.minSet, min_h: this.state.min_1, min_l: this.state.min_2, sec_h: this.state.sec_1, sec_l: this.state.sec_2 });}}>
            <Text style = {styles.buttonText}>{'Leave focus mode'}</Text>
           </TouchableOpacity>
           <View style = {styles.bubble}>
            <Text style = {styles.bubbleText}>{'\n'}{'There are'}</Text>
            <Text style = {styles.timerText}>{this.state.min_1}{this.state.min_2}{':'}{this.state.sec_1}{this.state.sec_2}</Text>
            <Text style = {styles.bubbleText}>{'left in the focus session'}</Text>
           </View>
           <View style = {styles.arrow}/>
           <Image source={require('../assets/home_page.png')} style = {styles.image} resizeMode = 'contain'/>
        </View>
      );
    }
}


const styles = StyleSheet.create({

  background: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    backgroundColor: 'black',
    paddingHorizontal: 80
  },

  button: {
    backgroundColor: "#506F4C", 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    top: '5%', 
    right: '35%',
    width: '80%', 
    height:'6%', 
    borderRadius: 15, 
  },

  buttonText: {
    fontFamily: "Roboto",
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
  },

  container: {
    width: 200,
    zIndex: 100,
  },

  dropDownContainer: {
    borderWidth: 0,
    zIndex: 100,
  },

  dropDown: {
    borderWidth: 0,
    zIndex: 100,
  },

  icon: {
    color: '#B8C59E',
  },

  bubble: {
    flexDirection: 'column',
    backgroundColor: '#506F4C',
    alignItems: "center",
    paddingHorizontal: 10,
    top: '22%',
    height: '27%',
    width: '140%',
    borderRadius: 25,
    borderWidth: 7,
    borderColor: 'black'
  },

  bubbleText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  timerText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 65,
    fontWeight:'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  image: {
    top: '19%',
    height: '18%',
    width: '100%',
    left: '38%',
  },

  arrow: {
    top: '21%',
    left: '38.5%',
    width: 30,
    height: 30,
    borderWidth: 20,
    borderTopColor: '#506F4C',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
}

  });

export default TimerPage;