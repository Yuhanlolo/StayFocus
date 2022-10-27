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
  TouchableOpacity,
  Alert,
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
import auth from '@react-native-firebase/auth';

import AboutPage from './AboutPage';
import ReminderPage from './ReminderPage';
import LoginPage from './LoginPage';

class ControlPanel extends Component {

constructor(props) {super(props); }

logoff ()
{
   auth()
    .signOut()
    .then(() => {
      console.log('User signed out!');
      this.props.navigate('LoginPage');
    });
}

render(){
   return (
        <View style = {styles.background}>
         <Text style = {styles.baseText_1} onPress = {()=>{this.props.navigate('ReminderPage')}}>{"My Plan"}</Text>
         <Text style = {styles.baseText_2} onPress = {()=>{this.props.navigate('AboutPage')}}>{"About"}{'\n'}{"StayFocused"}</Text>
         <Text style = {styles.baseText_3} onPress = {()=>{auth().signOut().then(() => { console.log('User signed out!');this.props.navigate('LoginPage');});}}>{"Log Out"}</Text>
        </View>
      );
   }
}

  const styles = StyleSheet.create({

    background: {
     flex: 1,
     flexDirection: 'column',
     backgroundColor: '#506F4C',
     alignItems: "center",
     paddingHorizontal: 10
    },

    baseText_1: {
      fontSize: 18,
      top: '21%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      textDecorationLine: 'underline',
    },

    baseText_2: {
      fontSize: 18,
      top: '30%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      textDecorationLine: 'underline',
    },

    baseText_3: {
      fontSize: 18,
      top: '70%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      textDecorationLine: 'underline',
    },

  });

export default ControlPanel;