import React, { Component } from 'react';
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundTimer from 'react-native-background-timer';
import {
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  TouchableOpacity,
  BackHandler,
  AppState,
  Modal,
  NativeModules,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import database from '@react-native-firebase/database';

import HomePage from './HomePage';
import QuitPage from './QuitPage';
import SuccessPage from './SuccessPage';

import onDisplayNotification from '../projectWidgets/notification';
import lockTime from '../projectWidgets/lockTime';
import pastTime from '../projectWidgets/pastTime';
import calcuTimestamp from '../projectWidgets/timestampCauculate';

global.countDown_1 = 15;
global.outId = '1';
global.display = false;
global.back = true;
global.permit = false;
global.timerId = '1';
global.hour_p = -2;
global.min_p = -2;
global.sec_p = -2;
global.hour_c = -2;
global.min_c = -2;
global.sec_c = -2;

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
        min_1: 0,
        min_2: 0,
        minSet_1: 0,
        minSet_2: 0,
        sec_1: 0,
        sec_2: 0,
        pause: true,
        temp: 0,
        modalVisible: false,
        onLock: 'unk',
      };
      }


      timeSetter()
      {
        let {timeSet, second_1, second_2, tag, userId, oneTimeId} = this.props.route.params;
        this.setState({temp: timeSet});
        this.setState({pause: true});
        this.setState({min_1: Math.floor(timeSet/10)});
        this.setState({min_2: timeSet-Math.floor(timeSet/10)*10});
        this.setState({userId: userId});
        this.setState({oneTimeId: oneTimeId});
        this.setState({onLock: 'unk'});
        countDown_1 = 10;
        display = true;
      }


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
                          let min_past = 0;
                          let sec_past = 0;

                          min_past, sec_past = pastTime();

                          let min_pre = this.state.min_1 * 10 + this.state.min_2;
                          let sec_pre = this.state.sec_1 * 10 + this.state.sec_2;

                          if(min_past * 60 + sec_past >= min_pre * 60 + sec_pre)
                          {
                              this.setState({sec_2:0});
                              this.setState({sec_1:0});
                              this.setState({min_2:0});
                              this.setState({min_1:0});
                              this.interval && clearInterval(this.interval);
                              this.props.navigation.navigate('SuccessPage', {focusTime: this.state.temp, id: this.state.userId, thisTime: this.state.oneTimeId});
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

      _handleAppStateChange = (nextAppState) => {
        BackgroundTimer.clearInterval(outId);
        BackgroundTimer.clearInterval(timerId);

      
        console.log("next time countDown_1: ", countDown_1);
        if (nextAppState === 'background') {
        countDown_1 = 15;
        display = true;
        back = false;
        outId = BackgroundTimer.setInterval(() => {
        if(countDown_1 > 0)
        {
          countDown_1 = countDown_1 - 1;
          if(countDown_1 > 10)
          {
            if(countDown_1 == 14)
            {
              lockTime();
            }
            NativeModules.LockDetectionModule.getScreenStatus().then((map)=> {
                                            this.setState({onLock:map['flag']}, ()=>{console.log('status: ',this.state.onLock);
                                            }
                                            );
                                }, (code, message)=> {});
          }
          if(countDown_1 == 10)
          {
                      NativeModules.LockDetectionModule.getScreenStatus().then((map)=> {
                                this.setState({onLock:map['flag']}, ()=>{console.log('status: ',this.state.onLock);

                                        if(display == true && on == true && this.state.onLock=='false')
                                        {
                                        this.setState({pause: false});
                                        console.log('out of control');
                                        timerId = onDisplayNotification();
                                        }
                                        }
                                );
                                }, (code, message)=> {});
          }
        }
        if(countDown_1 == 0)
        {
          countDown_1 = 0;
          BackgroundTimer.clearInterval(outId);
          BackgroundTimer.clearInterval(timerId);
        }
        },
        1100);
        console.log('**********running background**********');}
        if (nextAppState === 'active')
          {
            this.setState({pause: true});
            display = false;
            permit = false;
            back = true;
            console.log(countDown_1);
            if(countDown_1 == 0 && this.state.onLock=='false')
            {
              this.props.navigation.navigate('HomePage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId});
              countDown_1 = 15;
              this.timeOutData();
            }
             BackgroundTimer.clearInterval(outId);
             BackgroundTimer.clearInterval(timerId);
          }
    }

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

          let timestamp = calcuTimestamp();

          database()
           .ref('users/' + this.state.userId)
           .once('value')
           .then(
             snapshot => {

             focusBreaking = snapshot.val().focusBreak;

             focusBreaking = focusBreaking + 1;

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
               let meta = snapshot.val().metadata;
               if(meta[0].timestamp == '0')
               {
                 meta.pop();
               }
               let record = {timestamp: timestamp, quit: 'no'};
               meta.push(record);



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

          let timestamp = calcuTimestamp();

          database()
           .ref('users/' + this.state.userId)
           .once('value')
           .then(
             snapshot => {

             focusQuiting = snapshot.val().focusQuit;

             focusQuiting = focusQuiting + 1;

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
               let meta = snapshot.val().metadata;
               if(meta[0].timestamp == '0')
               {
                 meta.pop();
               }
               let record = {timestamp: timestamp, quit: 'yes'};
               meta.push(record);



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
               this.props.navigation.navigate('HomePage', {userId: this.state.userId, oneTimeId: this.state.oneTimeId});

               let focusQuiting = 0;
               let oneTimeQuit = 0;
               let focusTime = this.state.temp - this.state.min_1 * 10 - this.state.min_2;
               database()
                .ref('users/' + this.state.userId)
                .once('value')
                .then(
                  snapshot => {

                  focusQuiting = snapshot.val().focusQuit;

                  focusQuiting = focusQuiting + 1;

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
                       let meta = snapshot.val().metadata;
                       let temp = meta.pop();
                       temp.quit = 'yes';
                       meta.push(temp);


                       database()
                          .ref('users/' + this.state.userId + '/oneTimeBehavior/' + this.state.oneTimeId)
                          .update({metadata: meta, complete: focusTime.toString() + 'mins'})
                          .then(snapshot => {console.log('Data updated oneTime');})
                          .catch(error=>{console.log(error)});
                     }
                   );
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
      fontSize: 65,
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
      borderBottomStartRadius: 8.5,
      padding: 10,
      width: '53.5%',
      borderColor: '#B8C59E'
    },

    buttonRight: {
      backgroundColor: "#506F4C",
      alignItems: "center",
      borderBottomEndRadius: 8.5,
      padding: 10,
      width: '53.5%',
      height: '100%',
      borderColor: '#B8C59E'
    },

    buttonContainer: {
     flex: 1,
     flexDirection: 'row',
     height: '25%',
    }
  });

export default TimerPage;