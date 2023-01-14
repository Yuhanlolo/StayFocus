import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import database from '@react-native-firebase/database';

import ChatHome from './ChatHome';
import ChatTimer from './ChatTimer';

class QuitPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        minLeft: 0,
        secLeft: 0,
        userId: '',
        oneTimeId: '',
        timeSet: 0,
      };
      }

    backAction = () => {
        return true;
   };

    componentWillUnmount() {
        this.backHandler.remove();
    }

     componentDidMount()
     {
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
        let uid = this.props.route.params.userId;
        this.setState({userId: uid});
        let oneTime = this.props.route.params.oneTimeId;
        this.setState({oneTimeId: oneTime});
        let min_high = this.props.route.params.min_h;
        let min_low = this.props.route.params.min_l;
        this.setState({minLeft: 10*min_high + min_low});
        let sec_high = this.props.route.params.sec_h;
        let sec_low = this.props.route.params.sec_l;
        this.setState({secLeft: 10*sec_high + sec_low});
        let timeSet = this.props.route.params.timeSet;
        this.setState({timeSet: timeSet});
     }

    render() {
      return (
        <View style = {styles.background}>
         <Text style = {styles.timerText}>{'Back to focus mode'}{' {'}{this.state.minLeft}{':'}{this.state.secLeft}{'}'}</Text>
         <View style = {styles.wrapper}>
          <Image source={require('../assets/negative.png')} style = {styles.image} resizeMode = 'contain'/>
          <View style = {styles.container}>
          <View style = {styles.textContainer}>
          <Text style = {styles.baseText}>{"Hey! Are you sure you're leaving the focus mode now?"}</Text>
          </View>
          <View style = {styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonLeft}
            onPress={() => {
              DeviceEventEmitter.emit('changeResult');
              this.props.navigation.navigate('TimerPage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId, timeSet: this.state.timeSet, minSet: this.state.minLeft, secSet: this.state.secLeft});
            }}>
            <Text style = {styles.buttonText}>{'No'}</Text>
          </TouchableOpacity>
          <Text>{' '}</Text>
          <TouchableOpacity
            style={styles.buttonRight}
            onPress={() => {
              this.props.navigation.navigate('HomePage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId});
            }}>
            <Text style = {styles.buttonText}>{'Yes'}</Text>
          </TouchableOpacity>
          </View>
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
     paddingHorizontal: 10
    },

    wrapper:{
      flex: 1,
      flexDirection: 'column',
      alignItems: "center",
    },

    baseText: {
       fontSize: 17,
       fontFamily: "Roboto",
       top: '20%',
       color: 'white',
       textAlign: 'center',
       textAlignVertical: 'center',
     },

    container: {
     flexDirection: 'column',
     backgroundColor: '#506F4C',
     alignItems: "center",
     paddingHorizontal: 10,
     top: '5%',
     height: '20%',
     left: '8%',
     width: '75%',
     borderRadius: 15,
     borderWidth: 7,
     borderColor: 'black'
    },

    image: {
      top: '22%',
      height: '8%',
      width: '100%',
      right: '38%',
    },

    textContainer: {
      flex: 2.05,
    },

    buttonContainer:{
      flex: 1, 
      flexDirection: 'row',
    },

    buttonText: {
      fontFamily: "Roboto",
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 18,
    },

    buttonRight: {
      backgroundColor: "white",
      alignItems: "center",
      height: '100%',
      borderBottomEndRadius: 8.5,
      padding: 10,
      width: '53.5%',
      borderColor: '#B8C59E'
    },

    buttonLeft: {
      backgroundColor: "white",
      alignItems: "center",
      height: '100%',
      borderBottomStartRadius: 8.5,
      padding: 10,
      width: '53.5%',
      borderColor: '#B8C59E'
    },

    timerText: {
      top: '4%',
      left: '5%',
      fontFamily: 'Roboto',
      fontSize: 18,
      color: 'white',
    },

  });

export default QuitPage;