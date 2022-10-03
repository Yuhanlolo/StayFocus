/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
      };
      }

//Save the time before user want to give up

     timeSetter()
     {
        let timeBreak = this.props.route.params.timeBreak;
        let secBreak_1 = this.props.route.params.secBreak_1;
        let secBreak_2 = this.props.route.params.secBreak_2;
        this.setState({min:timeBreak,});
        this.setState({sec_one: secBreak_1,});
        this.setState({sec_two: secBreak_2,});
     };

//Make timeSetter method execute without binding to events

     componentDidMount()
     {
       this.timeSetter();
     }

    render() {
      return (
        <View style = {styles.background}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
          this.props.navigation.navigate('HomePage');
          }}>
          <Text style = {styles.buttonText}>{'Give up'}</Text>
         </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
          this.props.navigation.navigate('TimerPage',{timeSet: this.state.min, second_1: this.state.sec_one, second_2: this.state.sec_two, tag: true});}}>
          <Text style = {styles.buttonText}>{'Keep on focusing'}</Text>
         </TouchableOpacity>
         <Text style = {styles.baseText}>{this.state.text_1}{'\n'}{this.state.text_2}</Text>
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
     justifyContent: "center",
     paddingHorizontal: 10
    },

    baseText: {
      fontSize: 25,
      position:'absolute',
      top:150,
      left:120,
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
      borderRadius: 15,
      padding: 10,
      width: 180,
      borderWidth: 7,
      borderColor: '#8D9E98'
    },

  });

export default QuitPage;