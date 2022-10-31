import React, { Component } from 'react';
import type {Node} from 'react';
import DatePicker from 'react-native-date-picker';
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
  Alert
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/FontAwesome';

const type=['25 Minutes', '50 Minutes', '75 Minutes','100 Minutes'];

class ReminderPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text_1: "My Plan",
        text_2: "For each day, I plan to focus at least",
        text_3: "I want to be reminded at",
        typeShow: false,
        minSet: 0,
        hour: 0,
        min: 0,
        date: new Date(),
      };
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
      date_1 = date.setDate(today.getDate() + 1);
      date_2 = date.setDate(today.getDate() + 2);
      date_3 = date.setDate(today.getDate() + 3);
      date_4 = date.setDate(today.getDate() + 4);
      date_5 = date.setDate(today.getDate() + 5);
      date_6 = date.setDate(today.getDate() + 6);
      date_7 = date.setDate(today.getDate() + 7);
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
            onPress={()=>{this.props.navigation.navigate('HomePage');}}
           />
        </View>
         <View style = {{top: '5%'}}>
         <Text style = {styles.baseText_1}>{this.state.text_1}</Text>
         <Text style = {styles.baseText_2}>{this.state.text_2}</Text>
         </View>
         <View style = {{top: '10%', width: '50%', }}>
         <TextInput
          style={{ top: '50%', height: 40, borderColor: '#506F4C', backgroundColor:'white', borderWidth: 3, width:'100%', borderRadius: 10, color: 'black', fontFamily: 'Roboto'}}
          placeholder="Enter a number"
          placeholderTextColor="black"
          clearTextOnFocus={true}
          onChangeText={(text) => {
            const newText = text.replace(/[^\d]+/, '');
            let num = Number(newText);
            if(num > 120)
            {
              num = 120;
            }
            if(num < 10)
            {
              num = 10;
            }
            this.setState({minSet: num});
          }}
         />
        <Menu style = {{left: '0%'}} onSelect={(value) => {this.setState({minSet: value});}}>
          <MenuTrigger style = {{ width: '10%', left: '85%'}}>
            <Text style={{color: '#B8C59E',  fontSize: 16,}}>{'▼'}</Text>
          </MenuTrigger>
          <MenuOptions customStyles={optionsCustomStyle}>
            <MenuOption style = {{alignItems: 'center',}} value={25} ><Text style = {{color: 'black'}}>{"25 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={50} ><Text style = {{color: 'black'}}>{"50 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={75} ><Text style = {{color: 'black'}}>{"75 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={100}><Text style = {{color: 'black'}}>{"100 Minutes"}</Text></MenuOption>
          </MenuOptions>
        </Menu>
        </View>
        <View style = {{top:'35%'}}>
         <Text style = {styles.baseText_3}>{this.state.text_3}</Text>
        </View>
         <View style = {styles.container}>
          <DatePicker date={this.state.date} mode = 'time' androidVariant = 'nativeAndroid' onDateChange={(text)=>
          {this.setState({date:text});
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
         <TouchableOpacity
          style={styles.button}
          onPress={() =>
            this.createPlan(this.state.hour, this.state.min)
         }>
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

    container: {
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

  });

const triggerCustomStyle = {
    triggerOuterWrapper: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
};
const optionsCustomStyle = {
    optionsContainer: {
        backgroundColor: 'white',
        marginTop: '10.5%',
        marginLeft: '1%',
        width: '45%',
        height: '18%',
        borderRadius: 10,
    },
    optionTouchable: {
        underlayColor: 'gray',
        activeOpacity: 40,
    },
    optionWrapper: {
        margin: 5,
    },
};

export default ReminderPage;