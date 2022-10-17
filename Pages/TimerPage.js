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
  DeviceEventEmitter,
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

import HomePage from './HomePage';
import QuitPage from './QuitPage';
import SuccessPage from './SuccessPage';

//This is a count-down timer.

class TimerPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text_1: "Tap the clock",
        text_2: "To start your focused time!",
        flag: true,
        set: false,
        userId: '',
        min_1: 0,
        min_2: 0,
        minSet_1: 0,
        minSet_2: 0,
        sec_1: 0,
        sec_2: 0,
        pause: true,
        temp: 0,
      };
      }

//Receive the params from HomePage and QuitPage to set timer

      timeSetter()
      {
        let {timeSet, second_1, second_2, tag, userId} = this.props.route.params;
        this.setState({temp: timeSet});
        this.setState({pause: true});
        this.setState({min_1: Math.floor(timeSet/10)});
        this.setState({min_2: timeSet-Math.floor(timeSet/10)*10});
        this.setState({userId: userId});
      }

//Timer

      timeCounter()
      {
        if(this.state.flag==true)
        {
           this.interval = setInterval(()=>
                    {
                        if(this.state.min_1==0 && this.state.min_2==0 && this.state.sec_1==0 && this.state.sec_2==0)
                        {
                          this.setState({sec_2:0});
                          this.setState({sec_1:0});
                          this.setState({min_2:0});
                          this.setState({min_1:0});
                          this.interval && clearInterval(this.interval);
                          if(this.state.set == true)
                          {
                            this.props.navigation.navigate('SuccessPage');
                          }
                        }
                        if(this.state.pause == false)
                        {
                          this.setState({sec_2:this.state.sec_2});
                          this.setState({sec_1:this.state.sec_1});
                          this.setState({min_2:this.state.min_2});
                          this.setState({min_1:this.state.min_1});
                        }
                        else
                        {
                          this.setState({set: true});
                          this.setState({sec_2:this.state.sec_2-1});
                          if(this.state.sec_2 == -1)
                          {
                            this.setState({sec_2:9});
                            this.setState({sec_1:this.state.sec_1-1})
                            if(this.state.sec_1 == -1)
                            {
                              this.setState({sec_1:5});
                              this.setState({min_2:this.state.min_2-1});
                              if(this.state.min_2 == -1)
                              {
                                this.setState({min_2:9});
                                this.setState({min_1:this.state.min_1-1});
                              }
                            }
                          }

                        }
                    },1000);
        }
      }

//Make timeSetter method execute without binding to events

     componentDidMount()
     {
       this.timeSetter();
       this.timeCounter();
       this.listener = DeviceEventEmitter.addListener('changeResult', () => {
             this.setState({ pause: true });
           });
     }

    render() {
      return (
        <View style = {styles.background}>
        <View>
        <TouchableOpacity
          style={{backgroundColor: "#28454B", top: '10%', width: '25%', height:'22%', borderRadius: 15, alignItems: "center",}}
          onPress={() => {
          let focusBreaking = 0;
          this.setState({pause:false});
          this.props.navigation.navigate('QuitPage',{timeBreak:this.state.min_1*10+this.state.min_2, secBreak_1: this.state.sec_1, secBreak_2: this.state.sec_2, userId: this.state.userId});
          //console.log(this.state.userId);
          database()
           .ref('users/' + this.state.userId)
           .on('value', snapshot => {
             console.log('User data: ', snapshot.val());
             focusBreaking = snapshot.val().focusBreak + 1;
           });
           database()
            .ref('users/' + this.state.userId)
            .update({focusBreak: focusBreaking,})
            .then(snapshot => {console.log('Data updated');})
            .catch(error=>{console.log(error)});
            }}>
          <Text style={{fontFamily: "Cochin", color: 'white', textAlign: 'center', textAlignVertical: 'center', fontSize: 18,}}>{'Give up'}</Text>
         </TouchableOpacity>
         </View>
         <View style = {styles.timer}>
          <Text style = {styles.baseText}>
          <Text style = {styles.timeText}>{this.state.min_1}{this.state.min_2}{':'}{this.state.sec_1}{this.state.sec_2}</Text>

          </Text>
        </View>
        </View>
      );
    }
}

  const styles = StyleSheet.create({

    background: {
     flex: 1,
     flexDirection: 'column',
     backgroundColor: '#8D9E98',
     paddingHorizontal: 10
    },

    timer: {
     alignItems: "center",
    },

    baseText: {
      top: '45%',
      fontFamily: "Cochin",
      color: 'white',
    },

    timeText: {
      fontSize: 60,
    },
  });

export default TimerPage;