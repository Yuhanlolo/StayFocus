import React, { Component } from 'react';
import type {Node} from 'react';
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
  BackHandler,
  AppState,
  Modal,
  NativeModules,
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

global.countDown_1 = 11;
global.outId = '1';
global.display = false;
global.back = true;
global.timerId = '1';
global.sec_l = -2;
global.sec_h = -2;
global.min_l = -2;
global.min_h = -2;
global.lockId = '1';
//This is a count-down timer.

class TimerPage extends Component {
    constructor(props) {
      super(props);

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
        modalVisible: false,
        onLock: 'unk',
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
        this.setState({onLock: 'unk'});
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
                        if(this.state.onLock == 'true')
                        {
                          this.setState({onLock: 'unk'});
                          this.setState({sec_2:sec_l});
                          this.setState({sec_1:sec_h});
                          this.setState({min_2:min_l});
                          this.setState({min_1:min_h});
                        }
                        if(this.state.onLock != 'true' && this.state.pause == true && !(this.state.min_1==0 && this.state.min_2==0 && this.state.sec_1==0 && this.state.sec_2==0))
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
          id: 'stone_fox',
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
          if(display == true && on == true)
          {
          notifee.displayNotification({
          id: 'stone_fox',
          title: '<b>Stay Focused</b>',
          body: "The focus mode has ended.",
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        });}
          //read data
        }
        else
        {
          countDown_2 = countDown_2 - 1;
          if(back == false && on == true){
          notifee.displayNotification({
          id: 'stone_fox',
          title: '<b>Stay Focused</b>',
          body: "The focus mode will end in " + countDown_2.toString() + " seconds. Click here back to StayFocused",
          android: {
            channelId,
            smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
            importance: AndroidImportance.HIGH,
            // pressAction is needed if you want the notification to open the app when pressed
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
        console.log("next time countDown_1: ", countDown_1);
        if (nextAppState === 'background') {
        countDown_1 = 11;
        display = true;
        back = false;
        outId = BackgroundTimer.setInterval(() => {
        if(countDown_1 > 0)
        {
          countDown_1 = countDown_1 - 1;
          if(countDown_1 == 10)
          {
                      NativeModules.LockDetectionModule.getScreenStatus().then((map)=> {
                                this.setState({onLock:map['flag']}, ()=>{console.log('status: ',this.state.onLock);
                                        sec_l = this.state.sec_2;
                                        sec_h = this.state.sec_1;
                                        min_l = this.state.min_2;
                                        min_h = this.state.min_1;
                                        if(display == true && on == true && this.state.onLock=='false')
                                        {
                                        this.setState({pause: false});
                                        console.log('out of control');
                                        timerId = this.onDisplayNotification();

                                        }

                                        if(display == true && on == true && this.state.onLock=='true')
                                        {
                                            lockId = BackgroundTimer.setInterval(()=>{
                                            if(min_h==0 && min_l==0 && sec_h==0 && sec_l==0)
                                            {
                                               min_h = 0;
                                               min_l = 0;
                                               sec_h = 0;
                                               sec_l = 0;
                                               BackgroundTimer.clearInterval(lockId);
                                            }
                                            else{
                                                sec_l = sec_l -1;
                                                if(sec_l == -1)
                                                {
                                                  sec_l = 9;
                                                  sec_h = sec_h - 1;
                                                  if(sec_h == -1)
                                                  {
                                                    sec_h = 5;
                                                    min_l = min_l - 1;
                                                    if(min_l == -1)
                                                    {
                                                      min_l = 9;
                                                      min_h = min_h - 1;
                                                    }
                                                  }
                                                }}
                                            },1000);
                                        }}
                                );
                                }, (code, message)=> {});
          }
        }
        if(countDown_1 == 0)
        {
          countDown_1 = 0;
          BackgroundTimer.clearInterval(outId);
        }
        },
        1100);
        console.log('**********running background**********');}
        //console.log('ifOnPage:', this.state.onPage);
        if (nextAppState === 'active')
          {
            this.setState({pause: true});
            BackgroundTimer.clearInterval(lockId);
            display = false;
            back = true;
            console.log(countDown_1);
            if(countDown_1 == 0 && this.state.onLock=='false')
            {
              this.props.navigation.navigate('HomePage');
              countDown_1 = 11;
              this.timeOutData();
            }
             BackgroundTimer.clearInterval(outId);
             BackgroundTimer.clearInterval(timerId);
             this.cancel('stone_fox');
             notifee.cancelAllNotifications(['stone_fox']);
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
       this.timeSetter();
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
     }

    backAction = () => {
        return true;
   };

    componentWillUnmount() {
        this.backHandler.remove();
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
         //this.props.navigation.navigate('QuitPage',{timeBreak:this.state.min_1*10+this.state.min_2, secBreak_1: this.state.sec_1, secBreak_2: this.state.sec_2, userId: this.state.userId, oneTimeId: this.state.oneTimeId, endTime: focusTime});
     }

     timeOutData()
     {
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
             focusQuiting = snapshot.val().focusQuit;
             //console.log('original break：' + focusBreaking.toString());
             focusQuiting = focusQuiting + 1;
             //console.log('update:' + focusBreaking.toString());
             database()
              .ref('users/' + this.state.userId)
              .update({focusQuit: focusQuiting,})
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
               let record = {timestamp: timestamp, quit: 'yes'};
               meta.push(record);
               //oneTimeBreaking = snapshot.val().oneQuitTry;
               //oneTimeBreaking = oneTimeBreaking + 1;


               database()
                  .ref('users/' + this.state.userId + '/oneTimeBehavior/' + this.state.oneTimeId)
                  .update({focusDuration: focusSet.toString() + 'mins', metadata: meta, complete: focusTime.toString() + 'mins'})
                  .then(snapshot => {console.log('Data updated oneTime');})
                  .catch(error=>{console.log(error)});
             }
           );

     }

     confirmData()
          {
               this.setState({pause:false});
               this.props.navigation.navigate('HomePage', {userId: this.state.userId});
               //console.log(this.state.userId);
               let focusQuiting = 0;
               let oneTimeQuit = 0;
               let focusTime = this.state.temp - this.state.min_1 * 10 - this.state.min_2;
               database()
                .ref('users/' + this.state.userId)
                .once('value')
                .then(
                  snapshot => {
                  console.log('User data: ', snapshot.val());
                  //this.setState({focusBreaking: snapshot.val().focusBreak + 1});
                  focusQuiting = snapshot.val().focusQuit;
                  //console.log('original break：' + focusBreaking.toString());
                  focusQuiting = focusQuiting + 1;
                  //console.log('update:' + focusBreaking.toString());
                  database()
                   .ref('users/' + this.state.userId)
                   .update({focusQuit: focusQuiting,})
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
                       let meta = snapshot.val().metadata;
                       let temp = meta.pop();
                       temp.quit = 'yes';
                       meta.push(temp);
                       //oneTimeQuit = snapshot.val().oneQuit;
                       //oneTimeQuit = oneTimeQuit + 1;

                       database()
                          .ref('users/' + this.state.userId + '/oneTimeBehavior/' + this.state.oneTimeId)
                          .update({metadata: meta, complete: focusTime.toString() + 'mins'})
                          .then(snapshot => {console.log('Data updated oneTime');})
                          .catch(error=>{console.log(error)});
                     }
                   );
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
        <View style = {{alignItems: "center", flexDirection: 'column',justifyContent: "center",}}>
          <Modal
            style = {{alignItems: "center", flexDirection: 'column',}}
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible : !this.state.modalVisible});
            }}
          >
        <View style = {{alignItems: "center", flexDirection: 'column', top: '30%', height: "100%"}}>
        <View style = {styles.container}>
        <View style = {{flex: 2}}>
        <Text style = {styles.baseText}>{"Confirm to leave the focus mode?"}</Text>
        </View>
        <View style = {styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonLeft}
          onPress={() => {
            this.confirmData();
          }}>
          <Text style = {styles.buttonText}>{'Confirm'}</Text>
         </TouchableOpacity>
         <Text>{' '}</Text>
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={() => {
            this.setState({modalVisible : !this.state.modalVisible});
            this.setState({pause:true});
          }}>
          <Text style = {styles.buttonText}>{'Cancel'}</Text>
         </TouchableOpacity>
         </View>
         </View>
         </View>
          </Modal>
         </View>
        <View>
        <TouchableOpacity
          style={{backgroundColor: "#506F4C", top: '10%', width: '45%', height:'22%', borderRadius: 15, alignItems: "center",}}
          onPress={() => {
          this.setState({modalVisible : true});
          this.readData();
          this.setState({pause: false});
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
          <Text style={{fontFamily: "Roboto", color: 'white', textAlign: 'center', textAlignVertical: 'center', fontSize: 18, top:'15%'}}>{'Leave focus mode'}</Text>
         </TouchableOpacity>
         </View>
         <View style = {styles.timer}>
          <Text style = {styles.originBaseText}>
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

    originBaseText: {
      top: '90%',
      fontFamily: "Roboto",
      color: 'white',
    },

    timeText: {
      fontSize: 60,
    },

    container: {
     flexDirection: 'column',
     backgroundColor: '#B8C59E',
     justifyContent: "center",
     alignItems: "center",
     paddingHorizontal: 10,
     height: '22%',
     width: '80%',
     borderRadius: 15,
     borderWidth: 7,
     borderColor: 'black'
    },

    baseText: {
      fontSize: 20,
      fontFamily: "Roboto",
      top: '25%',
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    buttonText: {
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 18,
    },

    buttonLeft: {
      backgroundColor: "#506F4C",
      alignItems: "center",
      //top: '-6%',
      borderBottomStartRadius: 8.5,
      padding: 10,
      width: '53.5%',
      //borderWidth: 5,
      borderColor: '#B8C59E'
    },

    buttonRight: {
      backgroundColor: "#506F4C",
      alignItems: "center",
      //top: '-6%',
      borderBottomEndRadius: 8.5,
      padding: 10,
      width: '53.5%',
      height: '100%',
      //borderWidth: 5,
      borderColor: '#B8C59E'
    },

    buttonContainer: {
     flex: 1,
     flexDirection: 'row',
     height: '25%',
     //top: '35%',
    }
  });

export default TimerPage;