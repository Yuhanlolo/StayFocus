import React, { Component } from 'react';
import type {Node} from 'react';
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
  TouchableOpacity
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
import TimerPage from './TimerPage';

//When user want to give up focusing, this page come out to verify

class QuitPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text: "Confirm to leave the focus mode?",
        min: 0,
        sec_one: 0,
        sec_two: 0,
        userId: '',
        oneTimeId: '',
        focusTime: 0,
      };
      }

//Make timeSetter method execute without binding to events

     componentDidMount()
     {
       this.timeSetter();
     }


//Save the time before user want to give up

     timeSetter()
     {
        let timeBreak = this.props.route.params.timeBreak;
        let secBreak_1 = this.props.route.params.secBreak_1;
        let secBreak_2 = this.props.route.params.secBreak_2;
        let id = this.props.route.params.userId;
        let oneId = this.props.route.params.oneTimeId;
        let time = this.props.route.params.endTime;
        this.setState({min:timeBreak,});
        this.setState({sec_one: secBreak_1,});
        this.setState({sec_two: secBreak_2,});
        this.setState({userId: id,});
        this.setState({oneTimeId: oneId,});
        this.setState({focusTime: time,});
     };

     readData()
          {
               this.setState({pause:false});
               this.props.navigation.navigate('HomePage', {userId: this.state.userId});
               //console.log(this.state.userId);
               let focusQuiting = 0;
               let oneTimeQuit = 0;
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
                          .update({metadata: meta, complete: this.state.focusTime.toString() + 'mins'})
                          .then(snapshot => {console.log('Data updated oneTime');})
                          .catch(error=>{console.log(error)});
                     }
                   );
          }

    render() {
      return (
        <View style = {styles.background}>
        <View style = {styles.container}>
        <Text style = {styles.baseText}>{this.state.text}</Text>
        <View style = {styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonLeft}
          onPress={() => {
          this.readData();
          }}>
          <Text style = {styles.buttonText}>{'Confirm'}</Text>
         </TouchableOpacity>
         <Text>{' '}</Text>
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={() => {
           DeviceEventEmitter.emit('changeResult');
           this.props.navigation.navigate('TimerPage',{timeSet: this.state.min, second_1: this.state.sec_one, second_2: this.state.sec_two, tag: true, userId: this.state.userId, });
          }}>
          <Text style = {styles.buttonText}>{'Cancel'}</Text>
         </TouchableOpacity>
         </View>
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
     alignItems: "center",
     paddingHorizontal: 10
    },

    container: {
     flexDirection: 'column',
     backgroundColor: '#B8C59E',
     alignItems: "center",
     paddingHorizontal: 10,
     top: '35%',
     height: '20%',
     width: '80%',
     borderRadius: 15,
     borderWidth: 7,
     borderColor: 'black'
    },

    baseText: {
      fontSize: 18,
      fontFamily: "Roboto",
      top: '20%',
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    buttonText: {
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    buttonLeft: {
      backgroundColor: "#506F4C",
      alignItems: "center",
      top: '-6%',
      borderBottomStartRadius: 8.5,
      padding: 10,
      width: '53.5%',
      //borderWidth: 5,
      borderColor: '#B8C59E'
    },

    buttonRight: {
      backgroundColor: "#506F4C",
      alignItems: "center",
      top: '-6%',
      borderBottomEndRadius: 8.5,
      padding: 10,
      width: '53.5%',
      //borderWidth: 5,
      borderColor: '#B8C59E'
    },

    buttonContainer: {
     flexDirection: 'row',
     top: '24%',
    }
  });

export default QuitPage;