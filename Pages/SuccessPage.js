import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import database from '@react-native-firebase/database';

import HomePage from './HomePage';
import calcuTimestamp from '../projectWidgets/timestampCauculate';

class SuccessPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text: "Great job! You have finished your focusing goal!",
        userId: '',
        oneTimeId: '',
      };
      }

    timeSetter()
    {
        let time = this.props.route.params.focusTime;
        let userId = this.props.route.params.id;
        let oneTimeId = this.props.route.params.thisTime;

        this.setState({userId: userId});
        this.setState({oneTimeId: oneTimeId});

        let timestamp = calcuTimestamp();

        database()
           .ref('users/' + userId + '/oneTimeBehavior/' + oneTimeId)
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
                  .ref('users/' + userId + '/oneTimeBehavior/' + oneTimeId)
                  .update({focusDuration: time.toString() + 'mins', metadata: meta, complete: time.toString() + 'mins'})
                  .then(snapshot => {console.log('Data updated oneTime');})
                  .catch(error=>{console.log(error)});
             }
           );
    }

    backAction = () => {
        return true;
   };

    componentWillUnmount() {
        this.backHandler.remove();
    }

     componentDidMount()
     {
       this.timeSetter();
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
     }

    render() {
      return (
        <View style = {styles.background}>
         <View style = {styles.container}>
         <View style = {{flex: 2}}>
         <Text style = {styles.baseText}>{this.state.text}</Text>
         </View>
         <View style = {{flex: 1, width: '100%', alignItems: "center",}}>
         <TouchableOpacity
          style={styles.buttonRight}
          onPress={() => {
           this.props.navigation.navigate('HomePage');
          }}>
          <Text style = {styles.buttonText}>{'Back to home'}</Text>
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

     baseText: {
       fontSize: 18,
       fontFamily: "Roboto",
       top: '20%',
       color: 'black',
       textAlign: 'center',
       textAlignVertical: 'center',
     },

    container: {
     flexDirection: 'column',
     backgroundColor: '#B8C59E',
     alignItems: "center",
     paddingHorizontal: 10,
     top: '35%',
     height: '22%',
     width: '80%',
     borderRadius: 15,
     borderWidth: 7,
     borderColor: 'black'
    },

    buttonText: {
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 18,
    },

    buttonRight: {
      backgroundColor: "#506F4C",
      alignItems: "center",
      height: '100%',
      //top: '34%',
      borderBottomEndRadius: 8.5,
      borderBottomStartRadius: 8.5,
      padding: 10,
      width: '108.5%',
      //borderWidth: 5,
      borderColor: '#B8C59E'
    },

  });

export default SuccessPage;