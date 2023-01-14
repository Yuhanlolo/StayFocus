import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  Image,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import database from '@react-native-firebase/database';

import ChatHome from './ChatHome';
import SetTimePage from './SetTimePage';

class SuccessPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        timeSet: 0,
        userId: '',
        oneTimeId: '',
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
        let time = this.props.route.params.timeSet;
        this.setState({timeSet: time});
        let id = this.props.route.params.userId;
        this.setState({userId: id});
        let item = this.props.route.params.oneTimeId;
        this.setState({oneTimeId: item});
     }

    render() {
      return (
        <View style = {styles.background}>
         <View style = {styles.wrapper}>
          <Image source={require('../assets/positive.png')} style = {styles.image} resizeMode = 'contain'/>
          <View style = {styles.containerFirst}>
          <View style = {styles.textContainer}>
          <Text style = {styles.baseText}>{"Great job! You have completed the focus mode for "}{this.state.timeSet}{" minutes!"}</Text>
          </View>
          </View>
          <View style = {styles.containerSecond}>
          <View style = {styles.textContainer}>
          <Text style = {styles.baseText}>{"Do you want to have a rest or continue to keep focused?"}</Text>
          </View>
          <View style = {styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonLeft}
            onPress={() => {
              this.props.navigation.navigate('SetTimePage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId});
            }}>
            <Text style = {styles.buttonTextLeft}>{'Continue'}</Text>
          </TouchableOpacity>
          <Text>{' '}</Text>
          <TouchableOpacity
            style={styles.buttonRight}
            onPress={() => {
              this.props.navigation.navigate('HomePage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId});
            }}>
            <Text style = {styles.buttonTextRight}>{'Have a rest'}</Text>
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

     containerFirst: {
      flexDirection: 'column',
      backgroundColor: '#506F4C',
      alignItems: "center",
      paddingHorizontal: 10,
      top: '3%',
      height: '15%',
      left: '8%',
      width: '75%',
      borderRadius: 15,
      borderWidth: 7,
      borderColor: 'black'
     },

    containerSecond: {
     flexDirection: 'column',
     backgroundColor: '#506F4C',
     alignItems: "center",
     paddingHorizontal: 10,
     top: '4%',
     height: '20%',
     left: '8%',
     width: '75%',
     borderRadius: 15,
     borderWidth: 7,
     borderColor: 'black'
    },

    image: {
      top: '17%',
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

    buttonTextLeft: {
      fontFamily: "Roboto",
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 18,
    },

    buttonTextRight: {
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

export default SuccessPage;