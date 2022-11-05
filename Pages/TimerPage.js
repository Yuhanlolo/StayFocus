import React, { Component } from 'react';
import type {Node} from 'react';
import {Notifications} from 'react-native-notifications';
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundTimer from 'react-native-background-timer';
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

global.countDown_1 = 10;
global.outId = '1';
global.display = false;
global.back = true;
global.timerId = '1';
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
        outTime: false,
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
        this.setState({outTime: false});
        countDown_1 = 10;
        display = true;
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
                          //this.interval && clearInterval(this.interval);
                          if(this.state.set == true)
                          {
                            this.setState({sec_2:0});
                            this.setState({sec_1:0});
                            this.setState({min_2:0});
                            this.setState({min_1:0});
                            this.interval && clearInterval(this.interval);
                            this.props.navigation.navigate('SuccessPage', {focusTime: this.state.temp, id: this.state.userId, thisTime: this.state.oneTimeId});
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

      async onDisplayNotification() {
        let countDown_2 = 10;
        // Request permissions (required for iOS)
        await notifee.requestPermission();

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        // Display a notification

        const intervalId = BackgroundTimer.setInterval(() => {
        if(countDown_2 == 0)
        {
          countDown_2 = 0;
          BackgroundTimer.clearInterval(intervalId);
          this.setState({outTime: true});
          //read data
        }
        else
        {
          countDown_2 = countDown_2 - 1;
          if(back == false){
          notifee.displayNotification({
          id: '123',
          title: '<b>Stay Focused</b>',
          body: "The focus mode will end in " + countDown_2.toString() + " seconds. Click here back to StayFocused",
          android: {
            channelId,
            smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
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

      async cancel(notificationId) {
        await notifee.cancelNotification(notificationId);
      }

      _handleAppStateChange = (nextAppState) => {
        BackgroundTimer.clearInterval(outId);
        BackgroundTimer.clearInterval(timerId);

        //var timerId;
        console.log("next time countDown_1: ", countDown_1)
        if (nextAppState === 'background') {
        countDown_1 = 10;
        display = true;
        back = false;
        outId = BackgroundTimer.setInterval(() => {
        if(countDown_1 > 0)
        {
          countDown_1 = countDown_1 - 1;
        }
        if(countDown_1 == 0)
        {
          countDown_1 = 0;
          BackgroundTimer.clearInterval(outId);
        }
        },
        1100);

        console.log('**********running background**********');
        //console.log('ifOnPage:', this.state.onPage);
        if(display == true && on == true)
        {
        console.log('out of control');
        timerId = this.onDisplayNotification();}
        }
        if (nextAppState === 'active')
          {
            display = false;
            back = true;
            console.log(countDown_1);
            if(countDown_1 == 0)
            {
              this.props.navigation.navigate('HomePage');
              countDown_1 = 10;
            }
             BackgroundTimer.clearInterval(outId);
             BackgroundTimer.clearInterval(timerId);
             this.cancel('123');
             notifee.cancelAllNotifications(['123']);
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
          let focusSet = this.state.temp;

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
               console.log('passing data: ', this.state.oneTimeId);
               console.log('User oneTime data: ', snapshot.val());
               let meta = snapshot.val().metadata;
               console.log('User meta: ', meta);
               if(meta[0].timestamp == '0')
               {
                 meta.pop();
               }
               let record = {timestamp: timestamp, quit: 'no'};
               meta.push(record);
               //oneTimeBreaking = snapshot.val().oneQuitTry;
               //oneTimeBreaking = oneTimeBreaking + 1;


               database()
                  .ref('users/' + this.state.userId + '/oneTimeBehavior/' + this.state.oneTimeId)
                  .update({focusDuration: focusSet.toString() + 'mins', metadata: meta})
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
          style={{backgroundColor: "#506F4C", top: '10%', width: '45%', height:'22%', borderRadius: 15, alignItems: "center",}}
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
          <Text style={{fontFamily: "Roboto", color: 'white', textAlign: 'center', textAlignVertical: 'center', fontSize: 16, top:'15%'}}>{'Leave focus mode'}</Text>
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
     backgroundColor: 'black',
     paddingHorizontal: 10
    },

    timer: {
     alignItems: "center",
    },

    baseText: {
      top: '45%',
      fontFamily: "Roboto",
      color: 'white',
    },

    timeText: {
      fontSize: 60,
    },
  });

export default TimerPage;