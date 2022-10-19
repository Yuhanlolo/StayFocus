import React, { Component } from 'react';
import type {Node} from 'react';
import {Notifications} from 'react-native-notifications';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Picker,
  DeviceEventEmitter,
  TouchableOpacity,
  AppState,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import database from '@react-native-firebase/database';

import HomePage from './HomePage';
import QuitPage from './QuitPage';
import SuccessPage from './SuccessPage';

//This is a count-down timer.

class TimerPage extends Component {
    constructor(props) {
      super(props);

    Notifications.registerRemoteNotifications();

    Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
      console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
      completion({alert: false, sound: false, badge: false});
    });

    Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      completion();
    });


    Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
    console.log("Notification Received - Background", notification.payload);
    completion({alert: true, sound: true, badge: false});
            });

    this.state = {
        text_1: "Tap the clock",
        text_2: "To start your focused time!",
        flag: true,
        set: false,
        userId: '',
        oneTimeId: '',
        //focusBreaking: 0,
        min_1: 0,
        min_2: 0,
        minSet_1: 0,
        minSet_2: 0,
        sec_1: 0,
        sec_2: 0,
        pause: true,
        temp: 0,
      };
      }

//Receive the params from HomePage and QuitPage to set timer

      timeSetter()
      {
        let {timeSet, second_1, second_2, tag, userId, oneTimeId} = this.props.route.params;
        this.setState({temp: timeSet});
        this.setState({pause: true});
        this.setState({min_1: Math.floor(timeSet/10)});
        this.setState({min_2: timeSet-Math.floor(timeSet/10)*10});
        this.setState({userId: userId});
        this.setState({oneTimeId: oneTimeId});
      }

//Timer

      timeCounter()
      {
        if(this.state.flag==true)
        {
           this.interval = setInterval(()=>
                    {
                        if(this.state.min_1==0 && this.state.min_2==0 && this.state.sec_1==0 && this.state.sec_2==0)
                        {
                          this.setState({sec_2:0});
                          this.setState({sec_1:0});
                          this.setState({min_2:0});
                          this.setState({min_1:0});
                          this.interval && clearInterval(this.interval);
                          if(this.state.set == true)
                          {
                            this.props.navigation.navigate('SuccessPage');
                          }
                        }
                        if(this.state.pause == false)
                        {
                          this.setState({sec_2:this.state.sec_2});
                          this.setState({sec_1:this.state.sec_1});
                          this.setState({min_2:this.state.min_2});
                          this.setState({min_1:this.state.min_1});
                        }
                        else
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
                    },1000);
        }
      }

      _handleAppStateChange = (nextAppState) => {
           if (nextAppState === 'background') {
             	  console.log('**********running background**********');
                  Notifications.postLocalNotification({
                      title: "Stay Focused",
                      body: "Click here to continue your focus time!",
                      extra: "data"
                  });
           }
      }

//Make timeSetter method execute without binding to events

     componentDidMount()
     {
       this.timeSetter();
       this.timeCounter();
       this.listener = DeviceEventEmitter.addListener('changeResult', () => {
             this.setState({ pause: true });
           });
       AppState.addEventListener('change', this._handleAppStateChange);
     }

     readData()
     {
          this.setState({pause:false});
          //this.props.navigation.navigate('QuitPage',{timeBreak:this.state.min_1*10+this.state.min_2, secBreak_1: this.state.sec_1, secBreak_2: this.state.sec_2, userId: this.state.userId});
          //console.log(this.state.userId);
          let focusBreaking = 0;
          let oneTimeBreaking = 0;
          let focusTime = this.state.temp - this.state.min_1 * 10 - this.state.min_2;
          database()
           .ref('users/' + this.state.userId)
           .once('value')
           .then(
             snapshot => {
             console.log('User data: ', snapshot.val());
             //this.setState({focusBreaking: snapshot.val().focusBreak + 1});
             focusBreaking = snapshot.val().focusBreak;
             //console.log('original break：' + focusBreaking.toString());
             focusBreaking = focusBreaking + 1;
             //console.log('update:' + focusBreaking.toString());
             database()
              .ref('users/' + this.state.userId)
              .update({focusBreak: focusBreaking,})
              .then(snapshot => {console.log('Data updated');})
              .catch(error=>{console.log(error)});
           });

          database()
           .ref('users/' + this.state.userId + '/oneTimeBehavior/' + this.state.oneTimeId)
           .once('value')
           .then(
             snapshot=>
             {
               console.log('User oneTime data: ', snapshot.val());
               oneTimeBreaking = snapshot.val().oneQuitTry;
               oneTimeBreaking = oneTimeBreaking + 1;

               database()
                  .ref('users/' + this.state.userId + '/oneTimeBehavior/' + this.state.oneTimeId)
                  .update({oneQuitTry: oneTimeBreaking,})
                  .then(snapshot => {console.log('Data updated oneTime');})
                  .catch(error=>{console.log(error)});
             }
           );
         this.props.navigation.navigate('QuitPage',{timeBreak:this.state.min_1*10+this.state.min_2, secBreak_1: this.state.sec_1, secBreak_2: this.state.sec_2, userId: this.state.userId, oneTimeId: this.state.oneTimeId, endTime: focusTime});
     }

     updateData()
     {
           database()
              .ref('users/' + this.state.userId)
              .update({focusBreak: this.state.focusBreaking,})
              .then(snapshot => {console.log('Data updated');})
              .catch(error=>{console.log(error)});
     }

     setData()
     {
        var promise = Promise.resolve();
        promise .then(this.readData()).then(this.updateData());
     }

    render() {
      return (
        <View style = {styles.background}>
        <View>
        <TouchableOpacity
          style={{backgroundColor: "#28454B", top: '10%', width: '25%', height:'22%', borderRadius: 15, alignItems: "center",}}
          onPress={() => {
          this.readData();
          //this.setState({pause:false});
          //this.props.navigation.navigate('QuitPage',{timeBreak:this.state.min_1*10+this.state.min_2, secBreak_1: this.state.sec_1, secBreak_2: this.state.sec_2, userId: this.state.userId});
          //console.log(this.state.userId);
          //database()
          // .ref('users/' + this.state.userId)
          // .on('value', snapshot => {
          //   console.log('User data: ', snapshot.val());
          //   focusBreaking = snapshot.val().focusBreak;
          //   console.log('original break：' + focusBreaking.toString());
          //   focusBreaking = focusBreaking + 1;
          //   console.log('update:' + focusBreaking.toString());
          // });

           //console.log('update:' + focusBreaking.toString());

          // database()
          //    .ref('users/' + this.state.userId)
          //    .update({focusBreak: focusBreaking,})
          //    .then(snapshot => {console.log('Data updated');})
          //    .catch(error=>{console.log(error)});

            }}>
          <Text style={{fontFamily: "Cochin", color: 'white', textAlign: 'center', textAlignVertical: 'center', fontSize: 18,}}>{'Give up'}</Text>
         </TouchableOpacity>
         </View>
         <View style = {styles.timer}>
          <Text style = {styles.baseText}>
          <Text style = {styles.timeText}>{this.state.min_1}{this.state.min_2}{':'}{this.state.sec_1}{this.state.sec_2}</Text>

          </Text>
        </View>
        </View>
      );
    }
}

  const styles = StyleSheet.create({

    background: {
     flex: 1,
     flexDirection: 'column',
     backgroundColor: '#8D9E98',
     paddingHorizontal: 10
    },

    timer: {
     alignItems: "center",
    },

    baseText: {
      top: '45%',
      fontFamily: "Cochin",
      color: 'white',
    },

    timeText: {
      fontSize: 60,
    },
  });

export default TimerPage;