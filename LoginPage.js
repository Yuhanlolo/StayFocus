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

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from './HomePage';
import SignUpPage from './SignUpPage';

class LoginPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        title: "Log In",
        text_1: "E-mail :",
        text_2: "Password :",
        text_3: "Not a user yet?  ",
        text_4: "Sign up",
        text_5: "Start your focused time Now!",
        email: "",
        password: "",
      };
      }

    render() {
      return (
        <View style = {styles.background}>
         <Text style = {styles.baseText}>{this.state.title}</Text>
         <Text style = {styles.comments_1}>{this.state.text_1}</Text>
         <View style = {styles.inputContainer}>
         <TextInput
          style={{height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10,}}
          onChangeText={(text) => {
            this.setState({email: text});
          }}
        />
         </View>
         <Text style = {styles.comments_2}>{this.state.text_2}</Text>
         <View style = {styles.inputContainer}>
         <TextInput
          style={{top: '50%',height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10,}}
          password={true}
          onChangeText={(text) => {
            this.setState({password: text});
          }}
        />
        </View>
         <View style = {styles.container}>
           <Text style = {styles.helper}>{this.state.text_3}</Text>
            <TouchableOpacity
                      style={styles.buttonHelper}
                      onPress={() => {
                        this.props.navigation.navigate('SignUpPage');
                      }}>
                      <Text style = {styles.buttonText}>{this.state.text_4}</Text>
            </TouchableOpacity>
         </View>
            <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        this.props.navigation.navigate('HomePage');
                      }}>
                      <Text style = {styles.buttonText}>{this.state.text_5}</Text>
            </TouchableOpacity>
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

    baseText: {
      fontSize: 30,
      top: '10%',
      left: "10%",
      fontFamily: "Cochin",
      color: 'white',
    },

    comments_1: {
      top:'19%',
      left:'15%',
      fontFamily: "Cochin",
      color: 'white',
    },

    comments_2: {
      top:'22%',
      left:'15%',
      fontFamily: "Cochin",
      color: 'white',
    },

    container: {
      flexDirection: 'row',
      top: '40%',
      left: '9.3%',
    },

    inputContainer: {
      alignItems: "center",
      top: '20%',
    },

    helper: {
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    buttonHelper: {
      backgroundColor: "#28454B",
      borderRadius: 15,
      padding: 10,
    },

    button: {
      top: '40%',
      left:'25%',
      backgroundColor: "#28454B",
      alignItems: "center",
      borderRadius: 23,
      padding: 10,
      width: '50%',
      borderWidth: 7,
      borderColor: '#8D9E98'
    },

    buttonText: {
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    }
  });

export default LoginPage;