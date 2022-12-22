import React, { Component } from 'react';
import type {Node} from 'react';
import notifee, { AndroidImportance } from '@notifee/react-native';
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
  BackHandler,
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

    backAction = () => {
        return true;
   };

    componentDidMount()
    {
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

logoff ()
{
   auth()
    .signOut()
    .then(() => {
      console.log('User signed out!');
      notifee.cancelNotification('123');
      this.props.navigate('LoginPage');
    });
}

render(){
   return (
        <View style = {styles.background}>
         <Text style = {styles.baseText_1} onPress = {()=>{this.props.navigate('ReminderPage')}}>{"      My Plan      "}</Text>
         <Text style = {styles.baseText_2} onPress = {()=>{this.props.navigate('AboutPage')}}>{"        About        "}</Text>
         <Text style = {styles.baseText_3} onPress = {()=>{auth().signOut().then(() => { console.log('User signed out!');this.props.navigate('LoginPage');});}}>{"      Log Out      "}</Text>
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
      fontSize: 22,
      top: '5%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      borderBottomColor: '#B8C59E',
      borderBottomWidth: 2,
    },

    baseText_2: {
      fontSize: 22,
      top: '12%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      borderBottomColor: '#B8C59E',
      borderBottomWidth: 2,
    },

    baseText_3: {
      fontSize: 22,
      top: '80%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      borderBottomColor: '#B8C59E',
      borderBottomWidth: 2,
    },

  });

export default ControlPanel;