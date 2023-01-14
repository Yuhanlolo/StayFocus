import React, { Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  AppState,
  BackHandler,
  Image,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
class ChatTimerEnd extends Component {
    constructor(props) {
      super(props);
      this.state = {
      userId: '',
      oneTimeId: '',
      };
      }

    backAction = () => {
      return true;
   };

    _handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
          display = false;
        }
    }

    componentDidMount()
    {
      AppState.addEventListener('change', this._handleAppStateChange);
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
    }

    componentWillUnmount() {
      this.backHandler.remove();
    }

    render() {
      return (
        <View style = {styles.background}>
           <View style = {styles.bubble}>
            <Text style = {styles.bubbleText}>{'\n'}{'Focus mode completed!'}</Text>
            <Text style = {styles.timerText}>{'00:00'}</Text>
            <Text style = {styles.bubbleTextPress} onPress = {() => {}}>{'Back to home'}</Text>
           </View>
           <View style = {styles.arrow}/>
           <Image source={require('../assets/home_page.png')} style = {styles.image} resizeMode = 'contain'/>
        </View>
      );
    }
}


const styles = StyleSheet.create({

  background: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    backgroundColor: 'black',
    paddingHorizontal: 80
  },

  container: {
    width: 200,
    zIndex: 100,
  },

  dropDownContainer: {
    borderWidth: 0,
    zIndex: 100,
  },

  dropDown: {
    borderWidth: 0,
    zIndex: 100,
  },

  icon: {
    color: '#B8C59E',
  },

  bubble: {
    flexDirection: 'column',
    backgroundColor: '#506F4C',
    alignItems: "center",
    paddingHorizontal: 10,
    top: '22%',
    height: '27%',
    width: '140%',
    borderRadius: 25,
    borderWidth: 7,
    borderColor: 'black'
  },

  bubbleText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  timerText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 65,
    fontWeight:'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  bubbleTextPress: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    textDecorationLine: 'underline',
  },

  image: {
    top: '20%',
    height: '18%',
    width: '100%',
    left: '38%',
  },

  arrow: {
    top: '21%',
    left: '38.5%',
    width: 30,
    height: 30,
    borderWidth: 20,
    borderTopColor: '#506F4C',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
}

  });

export default ChatTimerEnd;