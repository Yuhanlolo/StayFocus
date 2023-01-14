import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AppState,
  BackHandler,
  Pressable,
  Image,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Drawer from 'react-native-drawer';

import SetTimePage from './SetTimePage';
import ControlPanel from './ChatPanel';
import { Gear } from '../Icons/icons';


class HomePage extends Component {
    constructor(props) {
      super(props);
      this.state = {
      temp:'0',
      userId: '',
      oneTimeId: '',
      drawerOpen: false,
      drawerDisabled: false,
      };
      }

    backAction = () => {
      return true;
   };

    closeDrawer = () => {
      this._drawer.close()
    };
    openDrawer = () => {
      this._drawer.open()
    };

    userSetter()
    {
      let id = this.props.route.params.userId;
      this.setState({userId: id});
      let item = this.props.route.params.oneTimeId;
      this.setState({oneTimeId: item});
    }

    _handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        display = false;
      }
    }

    componentDidMount()
    {
      this.userSetter();
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
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={
          <ControlPanel navigate={this.props.navigation.navigate} closeDrawer={this.closeDrawer} uid={this.state.userId} oneTime={this.state.oneTimeId}/>
        }
        acceptDoubleTap
        styles={{
          mainOverlay: {
            backgroundColor: 'black',
            opacity: 0,
          },
        }}
        tweenHandler={(ratio) => ({
          mainOverlay: {
           opacity: ratio / 2,
          }
        })}
        onOpen={() => {
          this.setState({drawerOpen: true});
        }}
        onClose={() => {
          this.setState({drawerOpen: false});
        }}

        captureGestures={false}
        tweenDuration={100}
        panThreshold={0.08}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={0.5}
        panOpenMask={0.2}
        negotiatePan
         >

        <ScrollView contentContainerStyle = {styles.background}>
        <Pressable onPress={()=>{this.openDrawer()}} style = {{top: '4%', right: '67%'}}>
          <Gear size={32} color={styles.icon.color} />
        </Pressable>
           <View style = {styles.bubble}>
            <Text style = {styles.bubbleText}>{'\n'}{'Are you ready to focus'}{'\n'}{'with me?'}{'\n'}</Text>
            <Text style = {styles.bubbleTextPress} onPress = {() => { this.props.navigation.navigate('SetTimePage',{userId: this.state.userId, oneTimeId: this.state.oneTimeId});}}>{'Start'}</Text>
           </View>
           <View style = {styles.arrow}/>
           <Image source={require('../assets/home_page.png')} style = {styles.image} resizeMode = 'contain'/>
        </ScrollView>
      </Drawer>
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
    fontSize: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  bubbleTextPress: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 35,
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

  export default HomePage;