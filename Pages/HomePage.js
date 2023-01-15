import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AppState,
  BackHandler,
  Pressable,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Drawer from 'react-native-drawer';
import DropDownPicker from "react-native-dropdown-picker";

import TimerPage from './TimerPage';
import ControlPanel from './ControlPanel';
import { CaretDown, CaretUp, Gear } from '../Icons/icons';

global.errorMessage = '';

class HomePage extends Component {
    constructor(props) {
      super(props);
      this.state = {
      text: 'I want to keep focus for',
      minSet: 0,
      minTemp: '',
      areaIndex: '0',
      typeShow: false,
      flag: false,
      temp:'0',
      userId: '',
      oneTimeId: '',
      drawerOpen: false,
      drawerDisabled: false,
      select: false,
      mode: 'none',

      open: false,
      value: null,
      items: [
                 { label: "25 mins", value: 25 },
                 { label: "50 mins", value: 50 },
                 { label: "75 mins", value: 75 },
                 { label: "100 mins", value: 100 },
               ],
      isFocus: false,
      input: '',
      };
      this.setValue = this.setValue.bind(this);
      this.handleInput = this.handleInput.bind(this);
      }

  handleInput(text) {
     this.setState({input: text});
  }

  setOpen = (open) => {
    this.setState({
      open: open
    });
  }

  setValue = (callback) =>{
    this.setState(state => ({
      value: callback(state.value)
    }), ()=>{
      this.setState({minSet: this.state.value});
      this.setState({input: this.state.value.toString() + ' mins'});
    });
    this.setState({select: true});
    this.setState({mode: 'selection'});
  }

  setItems = (callback) =>{
    this.setState(state => ({
      items: callback(state.items)
    }));
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
                       <ControlPanel navigate={this.props.navigation.navigate} closeDrawer={this.closeDrawer} uid={this.state.userId}  oneTime={this.state.oneTimeId}/>
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
        <View style = {{top: '13%', alignItems: "center",}}>
        <Text style = {styles.textStyle}>{this.state.text}</Text>
        </View>
              <View style = {{top: '12%'}}>
                <DropDownPicker
                open={this.state.open}
                value={this.state.value}
                items={this.state.items}
                setOpen={this.setOpen}
                setValue={this.setValue}
                showTickIcon={false}
                setItems={this.setItems}
                containerStyle={styles.container}
                dropDownContainerStyle={styles.dropDownContainer}
                style={styles.dropDown}
                textStyle={styles.dropDownText}
                selectedItemLabelStyle={{
                fontWeight: "bold",
                 }}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                  errorMessage = '';
                  console.log('mode:', this.state.mode);
                  if(isNaN(Number(text, 10)))
                    {
                      if(text.indexOf('mins') == -1 && this.state.mode != 'selection')
                      {
                        errorMessage = 'Please input Arabic numbers.';
                      }
                      if(text.indexOf('mins') != -1)
                      {
                        let str = text.replace(' mins', '');
                        if(isNaN(Number(str, 10)) && this.state.mode != 'selection')
                        {
                          errorMessage = 'Please input Arabic numbers.';
                        }
                      }
                      text = text.replace(/[^0-9]/g,'');
                    }
                  if(Number(text) > 125 && this.state.mode != 'selection')
                      {
                        errorMessage = 'Please enter less than 125 minutes.';
                        this.setState({input: '125 mins'});
                        this.setState({minTemp: '125'});
                      }
                  else
                  {
                  this.setState({minTemp:text});
                  this.setState({input: text.toString() + ' mins'});
                  this.setState({select: true});
                  this.setState({mode: 'enter'});
                  }
                  }}
                  clearTextOnFocus={true}
                  onFocus={() => {
                    this.setState({open: false});
                    this.setState({isFocus: true});
                    this.setState({input: ''});
                    errorMessage = '';
                  }}
                  onEndEditing={() => {this.setState({isFocus: false});

                    errorMessage = '';
                  }}
                  value = {this.state.input}
                  keyboardType="numeric"
                  placeholder="Choose/enter focus time"
                  placeholderTextColor="black"
                  maxLength={32}
                />
                <Pressable style={styles.caret} onPress={() => {this.setOpen(!this.state.open); }}>
                  {this.state.open ? (
                    <CaretUp size={24} color={styles.caret.color} />
                  ) : (
                    <CaretDown size={24} color={styles.caret.color} />
                  )}
                </Pressable>
              </View>
        <View style = {{top: '36.5%'}}>
        <Text style={{fontFamily: 'Roboto', fontSize: 14, color: 'red', width: '100%'}}>{errorMessage}</Text>
        </View>
        <View style = {{top: '22%', width: '70%'}}>
        <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                  this.setState({flag:true});
                  if(this.state.select == false)
                  {
                    errorMessage = 'Please select your focus time!';
                  }
                  if(this.state.select == true)
                  {
                    if(this.state.mode == 'enter')
                    {
                    let inputs = this.state.minTemp;
                    if(isNaN(Number(inputs, 10)))
                    {
                      errorMessage = 'Please input Arabic numbers.';
                    }
                    else
                    {
                      if(Number(inputs) > 125)
                      {
                        errorMessage = 'Please enter less than 125 minutes.';
                      }
                      if(Number(inputs) < 25 && this.state.mode == 'enter')
                      {
                        errorMessage = 'Please enter more than 25 minutes.';
                      }
                      if(Number(inputs) >= 25 && Number(inputs) <= 125)
                      {
                        this.setState({minSet: Number(inputs)});
                        let timeNum = Number(inputs);
                        this.setState({input: ''});
                        this.props.navigation.navigate('TimerPage',{timeSet: timeNum, second_1: 0, second_2: 0, tag: true, userId: this.state.userId, oneTimeId: this.state.oneTimeId});
                      }
                    }
                     this.setState({mode: 'none'});
                     this.setState({input: ''});
                    }
                    if(this.state.mode == 'selection')
                    {
                      this.setState({input: ''});
                      this.props.navigation.navigate('TimerPage',{timeSet: this.state.minSet, second_1: 0, second_2: 0, tag: true, userId: this.state.userId, oneTimeId: this.state.oneTimeId});
                       this.setState({mode: 'none'});
                    }
                  }
                  }}>
                  <Text style = {styles.buttonText}>{'Start'}</Text>
        </TouchableOpacity>
        </View>
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

    textStyle: {
     fontFamily: 'Roboto',
     fontSize: 23,
     width: '60%',
     color: 'white',
    },

    button: {
     top: '70%',
     backgroundColor: "#506F4C",
     borderRadius: 15,
     width: '100%',
     height: '27%',
     padding: 10
    },

    buttonText: {
     color: 'white',
     fontSize: 22,
     fontFamily: 'Roboto',
     textAlign: 'center',
     textAlignVertical: 'center',
     left: '1%'
    },


  input: {
    position: "absolute",
    width: 200,
    height: 50,
    borderRadius: 6,
    backgroundColor: 'white',
    fontSize: 14,
    textAlign: "center",
    color: 'black',
    fontFamily: 'Roboto',
    padding: 8,
    zIndex: 200,
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
  caret: {
    position: "absolute",
    width: 32,
    height: 50,
    top: 13,
    right: -5,
    color: '#506F4C',
    zIndex: 300,
  },
  dropDownText: {
    textAlign: "center",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },

  icon: {
    color: '#B8C59E',
  },

  });

export default HomePage;