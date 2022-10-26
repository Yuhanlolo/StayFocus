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
  TextInput,
  TouchableOpacity
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
      };
      }

      _selectType = (index,value) => {
            console.log(index + '--' + value)
            this.setState({
                areaIndex: index
            });
            let time = value.substr(0);
            time = time.replace(' Minutes','');
            let num = Number(time);
            this.setState({minSet: num});
        }

      _separator = () => {
            return(
                <Text style={{height:0}}></Text>
            )
        }

      _adjustType = () => {
            return({
                justifyContent: "center",
                top: '37%',
                left: '29.6%',
                width: '40%'
            })
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
          style={{ top: '23%', height: 40, borderColor: '#506F4C', backgroundColor:'white', borderWidth: 3, width:'45%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            text = text.replace('m','');
            text = text.replace('i','');
            text = text.replace('n','');
            let num = Number(text);
            this.setState({minSet: num});
          }}
          //value = ' Input focusing time (e.g., 35mins)'
         />
        <Menu style = {{top: '18.5%', left: '18%'}} onSelect={(value) => {this.setState({minSet: value});}}>
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
         <TextInput
          style={{ top: '17%', height: 40, borderColor: '#506F4C', backgroundColor:'white', borderWidth: 3, width:'25%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            this.setState({hour: text});
          }}
          //value = ' Input focusing time (e.g., 35mins)'
         />
         <Text style = {styles.mark}>{':'}</Text>
         <TextInput
          style={{ top: '17%', height: 40, borderColor: '#506F4C', backgroundColor:'white', borderWidth: 3, width:'25%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            this.setState({min: text});
          }}
          //value = ' Input focusing time (e.g., 35mins)'
         />
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
      top: '12%',
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: 'bold',
    },

    baseText_2: {
      fontSize: 18,
      top: '17%',
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    baseText_3: {
      fontSize: 18,
      top: '47%',
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    container: {
      flexDirection: 'row',
      top: '85%',
      //left: '7.5%',
    },

    mark: {
     fontFamily: 'Cochin',
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
        marginTop: '15%',
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