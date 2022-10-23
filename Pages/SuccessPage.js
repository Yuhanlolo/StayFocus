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

import database from '@react-native-firebase/database';

//When finish the focusing task, this page come out for congrats.

class SuccessPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text: "Congrats! You have completed your focusing plan now!",
      };
      }

    timeSetter()
    {
        let time = this.props.route.params.focusTime;
        let userId = this.props.route.params.id;
        let oneTimeId = this.props.route.params.thisTime;

        console.log("userId:", userId);
        console.log("oneTime:", oneTimeId);

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
           .ref('users/' + userId + '/oneTimeBehavior/' + oneTimeId)
           .once('value')
           .then(
             snapshot=>
             {
               //console.log('passing data: ', this.state.oneTimeId);
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
                  .ref('users/' + userId + '/oneTimeBehavior/' + oneTimeId)
                  .update({focusDuration: time.toString() + 'mins', metadata: meta, complete: time.toString() + 'mins'})
                  .then(snapshot => {console.log('Data updated oneTime');})
                  .catch(error=>{console.log(error)});
             }
           );
    }

     componentDidMount()
     {
       this.timeSetter();
     }

    render() {
      return (
        <View style = {styles.background}>
         <Text style = {styles.baseText}>{this.state.text}</Text>
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

    baseText: {
      fontSize: 25,
      top: '40%',
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

  });

export default SuccessPage;