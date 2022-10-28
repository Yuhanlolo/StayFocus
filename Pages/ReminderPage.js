import React, { Component } from 'react';
import type {Node} from 'react';
import DatePicker from 'react-native-date-picker';
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
         <Text style = {styles.baseText_1}>{this.state.text_1}</Text>
         <Text style = {styles.baseText_2}>{this.state.text_2}</Text>
         <TextInput
          style={{ top: '15%', height: 40, borderColor: '#506F4C', backgroundColor:'white', borderWidth: 3, width:'45%', borderRadius: 10, color: 'black', fontFamily: 'Roboto'}}
          onChangeText={(text) => {
            text = text.replace('m','');
            text = text.replace('i','');
            text = text.replace('n','');
            let num = Number(text);
            this.setState({minSet: num});
          }}
          //value = ' Input focusing time (e.g., 35mins)'
         />
        <Menu style = {{top: '10.5%', left: '18%'}} onSelect={(value) => {this.setState({minSet: value});}}>
          <MenuTrigger style = {{ width: '100%',}}>
            <Text style={{color: '#B8C59E',  fontSize: 16,}}>{'▼'}</Text>
              </MenuTrigger>
          <MenuOptions customStyles={optionsCustomStyle}>
            <MenuOption style = {{alignItems: 'center',}} value={25} ><Text style = {{color: 'black'}}>{"25 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={50} ><Text style = {{color: 'black'}}>{"50 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={75} ><Text style = {{color: 'black'}}>{"75 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={100}><Text style = {{color: 'black'}}>{"100 Minutes"}</Text></MenuOption>
          </MenuOptions>
        </Menu>
         <Text style = {styles.baseText_3}>{this.state.text_3}</Text>
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
      top: '7%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: 'bold',
    },

    baseText_2: {
      fontSize: 18,
      top: '12%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    baseText_3: {
      fontSize: 18,
      top: '37%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    container: {
      flexDirection: 'row',
      top: '75%',
      //left: '7.5%',
    },

    mark: {
     fontFamily: 'Roboto',
     color: 'white',
     fontSize: 35,
     top: '14.5%',
    },

    iconContainer: {
     flexDirection: 'row',
     top: '8%',
     right: '18%'
     //justifyContent: "start",
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
        marginTop: '11%',
        marginLeft: '4.7%',
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