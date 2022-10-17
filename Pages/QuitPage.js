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
        text_1: "Are you sure to",
        text_2: "give up?",
        min: 0,
        sec_one: 0,
        sec_two: 0,
        userId: '',
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
        this.setState({min:timeBreak,});
        this.setState({sec_one: secBreak_1,});
        this.setState({sec_two: secBreak_2,});
        this.setState({userId: id,});
     };


    render() {
      return (
        <View style = {styles.background}>
        <Text style = {styles.baseText}>{this.state.text_1}{'\n'}{this.state.text_2}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
          let focusQuiting = 0;
          this.props.navigation.navigate('HomePage', {userId: this.state.userId});
          database()
           .ref('users/' + this.state.userId)
           .on('value', snapshot => {
             console.log('User data: ', snapshot.val());
             focusQuiting = snapshot.val().focusQuit;
           });
            focusQuiting = focusQuiting + 1;
           database()
            .ref('users/' + this.state.userId)
            .update({focusQuit: focusQuiting,})
            .then(snapshot => {console.log('Data updated');})
            .catch(error=>{console.log(error)});
          }}>
          <Text style = {styles.buttonText}>{'Give up'}</Text>
         </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
           DeviceEventEmitter.emit('changeResult');
           this.props.navigation.navigate('TimerPage',{timeSet: this.state.min, second_1: this.state.sec_one, second_2: this.state.sec_two, tag: true, userId: this.state.userId, });
          }}>
          <Text style = {styles.buttonText}>{'Keep on focusing'}</Text>
         </TouchableOpacity>
        </View>
      );
    }
}

  const styles = StyleSheet.create({

    background: {
     flex: 1,
     flexDirection: 'column',
     backgroundColor: '#8D9E98',
     alignItems: "center",
     paddingHorizontal: 10
    },

    baseText: {
      fontSize: 25,
      top: '20%',
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    buttonText: {
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    button: {
      backgroundColor: "#28454B",
      alignItems: "center",
      top: '35%',
      borderRadius: 15,
      padding: 10,
      width: '40%',
      borderWidth: 7,
      borderColor: '#8D9E98'
    },

  });

export default QuitPage;