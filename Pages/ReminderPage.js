import React, { Component } from 'react';
import type {Node} from 'react';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from "react-native-dropdown-picker";
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
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
  TextInput,
  TouchableOpacity,
  BackHandler,
  Alert,
  Pressable,
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

import Icon from 'react-native-vector-icons/FontAwesome';
import { CaretDown, CaretUp, Gear } from '../Icons/icons';

global.errorMessage_reminder = '';

class ReminderPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text_1: "My Plan",
        text_2: "For each day, I plan to focus at least",
        text_3: "I want to be reminded at",
        typeShow: false,
        flag: false,
        temp:'0',
        minSet: 0,
        hour: 0,
        min: 0,
        date: new Date(),
        dateChosen: false,

        open: false,
        value: null,
        items: [
                 { label: "25 minutes", value: 25 },
                 { label: "50 minutes", value: 50 },
                 { label: "75 minutes", value: 75 },
                 { label: "100 minutes", value: 100 },
               ],
        isFocus: false,
        txt: '',
        minTemp: '',
        select: false,
        mode: 'none',
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
      console.log(this.state.value);
      this.setState({minSet: this.state.value});
      this.setState({input: this.state.value.toString()});
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

    componentWillUnmount() {
        this.backHandler.remove();
    }

     componentDidMount()
     {
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
     }

    async onCreateTriggerNotification(date, hour, min) {
    //const date = new Date(Date.now());
    date.setHours(hour);
    date.setMinutes(min);

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: '<b>Stay Focused</b>',
        body: "It's time to focus. Set your focusing goal now!",
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger,
    );
    }

    createPlan(hour, min)
    {
      let today = new Date();
      let date = new Date(today);
      let compareDate =  new Date(today);
      compareDate.setHours(hour);
      compareDate.setMinutes(min);
      let date_0;
      let date_1;
      let date_2;
      let date_3;
      let date_4;
      let date_5;
      let date_6;
      let date_7;
      date_0 = date.setDate(today.getDate());
      date_1 = date.setDate(today.getDate() + 1);
      date_2 = date.setDate(today.getDate() + 2);
      date_3 = date.setDate(today.getDate() + 3);
      date_4 = date.setDate(today.getDate() + 4);
      date_5 = date.setDate(today.getDate() + 5);
      date_6 = date.setDate(today.getDate() + 6);
      date_7 = date.setDate(today.getDate() + 7);
      console.log('now:', today);
      console.log('compare', compareDate);
      console.log('res:',compareDate - today);
      if(compareDate - today > 0)
      {
        this.onCreateTriggerNotification(new Date(date_0), hour, min);
        console.log("it's in.");
      }
      this.onCreateTriggerNotification(new Date(date_1), hour, min);
      this.onCreateTriggerNotification(new Date(date_2), hour, min);
      this.onCreateTriggerNotification(new Date(date_3), hour, min);
      this.onCreateTriggerNotification(new Date(date_4), hour, min);
      this.onCreateTriggerNotification(new Date(date_5), hour, min);
      this.onCreateTriggerNotification(new Date(date_6), hour, min);
      this.onCreateTriggerNotification(new Date(date_7), hour, min);
    }


    render() {
      return (
        <View style = {styles.background}>
        <View style = {styles.iconContainer}>
           <Icon.Button
            size={25}
            name="arrow-left"
            backgroundColor="#506F4C"
            color= "#B8C59E"
            onPress={()=>{this.props.navigation.navigate('HomePage');
            this.setState({input:''});}}
           />
        </View>
        <View style = {{alignItems: "center"}}>
         <View style = {{top: '5%'}}>
         <Text style = {styles.baseText_1}>{this.state.text_1}</Text>
         <Text style = {styles.baseText_2}>{this.state.text_2}</Text>
         </View>
         <View style = {{top: '20%', width: '50%', alignItems: "center", }}>
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
                  errorMessage_reminder = '';
                  if(isNaN(Number(text, 10)))
                    {
                      //Alert.alert('Please input Arabic numbers');
                      errorMessage_reminder = 'Please input Arabic numbers.';
                      text = text.replace(/[^0-9]/g,'');
                    }
                  if(Number(text) > 125)
                      {
                        //Alert.alert('Please enter less than 125 minutes');
                        errorMessage_reminder = 'Please enter less than 125 minutes.';
                        this.setState({input: '125'});
                      }
                  else
                  {
                  this.setState({minTemp:text});
                  this.setState({input: text.toString()});
                  this.setState({select: true});
                  this.setState({mode: 'enter'});
                  }
                                        }}
                  onFocus={() => {
                    this.setState({open: false});
                    this.setState({isFocus: true});
                    this.setState({input: ''});
                    errorMessage_reminder = '';
                  }}
                  clearTextOnFocus={true}
                  onEndEditing={() => {this.setState({isFocus: false});
                  if(Number(this.state.input) < 25)
                  {
                    errorMessage_reminder = 'Please enter more than 25 minutes.';
                    this.setState({input: '25'});
                  }
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
        <View style = {{top:'75%'}}>
         <Text style = {styles.baseText_3}>{this.state.text_3}</Text>
        </View>
         <View style = {styles.dateContainer}>
          <DatePicker date={this.state.date} mode = 'time' androidVariant = 'nativeAndroid' onDateChange={(text)=>
          {this.setState({date:text});
           this.setState({dateChosen: true});
           console.log(JSON.stringify(text));
           let time = JSON.stringify(text);
           let hour = time.substring(12,14);
           let min = time.substring(15,17);
           let hourNum = Number(hour) + 8;
           if(hourNum >= 24)
           {
             hourNum = hourNum - 24;
           }
           let minNum = Number(min);
           this.setState({hour:hourNum});
           this.setState({min:minNum});
           console.log(JSON.stringify(hourNum));
           console.log(JSON.stringify(minNum));
          }
          } textColor = '#ffffff' />
         </View>
         </View>
         <Text style={{fontFamily: 'Roboto', fontSize: 12, color: 'red', top: '34%'}}>{errorMessage_reminder}</Text>
         <TouchableOpacity
          style={styles.button}
          onPress={() =>{
            if(this.state.dateChosen == true)
            {
            this.createPlan(this.state.hour, this.state.min);
            }
            if(this.state.dateChosen == false)
            {
              //Alert.alert('Please make your focus plan!');
              errorMessage_reminder = 'Please make your focus plan!';
            }

                  this.setState({flag:true});
                  if(this.state.select == false)
                  {
                    //Alert.alert('Please select your focus time!');
                    errorMessage_reminder = 'Please select your focus time!';
                  }
                  if(this.state.select == true)
                  {
                    if(this.state.mode == 'enter')
                    {
                    let inputs = this.state.minTemp;
                    //console.log("time input: ", inputs);
                    if(isNaN(Number(inputs, 10)))
                    {
                      //Alert.alert('Please input Arabic numbers');
                      errorMessage_reminder = 'Please input Arabic numbers.';
                    }
                    else
                    {
                      if(Number(inputs) > 125)
                      {
                        //Alert.alert('Please enter less than 125 minutes');
                        errorMessage_reminder = 'Please enter less than 125 minutes.';
                      }
                      if(Number(inputs) < 25)
                      {
                        //Alert.alert('Please enter more than 25 minutes');
                        errorMessage_reminder = 'Please enter more than 25 minutes.';
                      }
                      if(Number(inputs) >= 25 && Number(inputs) <= 125)
                      {
                        //console.log(Number(inputs));
                        this.setState({minSet: Number(inputs)});
                        let timeNum = Number(inputs);
                        errorMessage_reminder = '';
                      }
                    }
                    }

          }
         }}>
          <Text style = {styles.buttonText}>{'Confirm'}</Text>
         </TouchableOpacity>
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
     paddingHorizontal: 10,
    },

    baseText_1: {
      fontSize: 24,
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: 'bold',
    },

    baseText_2: {
      fontSize: 18,
      top: '60%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    baseText_3: {
      fontSize: 18,
      top: '34%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    dateContainer: {
      flexDirection: 'row',
      top: '72%',
      //left: '7.5%',
    },

    mark: {
     fontFamily: 'Roboto',
     color: 'white',
     fontSize: 35,
     top: '14.5%',
    },

    iconContainer: {
     flexDirection: 'column',
     top: '2%',
     right: '40%',
     //justifyContent: "start",
    },

    button: {
      backgroundColor: "#B8C59E",
      alignItems: "center",
      width: '40%',
      top: '35%',
      borderRadius: 15,
      padding: 10,
    },

     baseText: {
       fontSize: 20,
       fontFamily: "Roboto",
       top: '20%',
       color: 'white',
       textAlign: 'center',
       textAlignVertical: 'center',
     },

     buttonText: {
       fontSize: 20,
       fontFamily: "Roboto",
       color: 'white',
       textAlign: 'center',
       textAlignVertical: 'center',
     },

    input: {
      position: "absolute",
      width: 200,
      height: 50,
      borderRadius: 6,
      backgroundColor: 'white',
      fontFamily: 'Roboto',
      color: 'black',
      fontSize: 16,
      padding: 8,
      zIndex: 200,
    },
    container: {
      width: 200,
      zIndex: 100,
    },
    dropDownContainer: {
      borderWidth: 0,
    },
    dropDown: {
      borderWidth: 0,
    },
    dropDownText: {
      textAlign: "center",
      fontSize: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    caret: {
      position: "absolute",
      width: 32,
      height: 50,
      top: 13,
      right: 0,
      color: '#506F4C',
      zIndex: 300,
    },

  });

export default ReminderPage;