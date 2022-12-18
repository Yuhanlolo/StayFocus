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
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Icon from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

class AboutPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text_1: "About",
        text_2: "StayFocus",
        text_3: "Instruction",
        text_4: "Privacy & Data Collection",
      };
      }

    backAction = () => {
        return true;
   };

    componentDidMount()
    {
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
         <View style = {styles.iconContainer}>
           <Icon.Button
            size={25}
            name="arrow-left"
            backgroundColor="#506F4C"
            color= "#B8C59E"
            onPress={()=>{this.props.navigation.navigate('HomePage');}}
           />
         </View>
         <Text style = {styles.baseText_1}>{this.state.text_1}{' '}{this.state.text_2}</Text>
         <Text style = {styles.baseText_2}>{this.state.text_3}</Text>
         <Text style = {styles.baseText_3}>{this.state.text_4}</Text>
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
     paddingHorizontal: 10
    },

    baseText_1: {
      fontSize: 26,
      top: '6%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: 'bold',
    },



    baseText_2: {
      fontSize: 20,
      top: '18%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    baseText_3: {
      fontSize: 20,
      top: '40%',
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    iconContainer: {
     flexDirection: 'row',
     top: '6%',
     right: '20%'
     //justifyContent: "start",
    },

  });

export default AboutPage;