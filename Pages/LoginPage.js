import React, { Component, useState, useEffect} from 'react';
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
  TouchableOpacity,
  Alert,
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

import auth from '@react-native-firebase/auth';

import HomePage from './HomePage';
import SignUpPage from './SignUpPage';

function Login()
  {
    // Set an initializing state whilst Firebase connects
     const [initializing, setInitializing] = useState(true);
     const [user, setUser] = useState();

    // Handle user state changes
     function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
          }

          useEffect(() => {
            const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            return subscriber; // unsubscribe on unmount
          }, []);

        if (initializing) return null;

        if (!user) {
            return (
              <View>
              </View>
            );
          }

     return (
        <View>
        </View>
     );
  }


class LoginPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        title: "Log In",
        text: "",
        text_1: "E-mail :",
        text_2: "Password :",
        text_3: "Not a user yet?  ",
        text_4: "Sign up",
        text_5: "Start your focused time Now!",
        email: "jane.doe@example.com",
        password: "SuperSecretPassword!",
      };
      }

     logoff = () =>
     {
       auth()
         .signOut()
         .then(() => {console.log('User signed out!');
                      this.setState({text: 'User signed out!'});});
     }

       signIn = () =>
       {
         auth()
           .signInWithEmailAndPassword(this.state.email, this.state.password)
           .then(() => {
             this.setState({text: 'User account created & signed in!'});
             this.props.navigation.navigate('HomePage');
           })
           .catch(error => {
             if (error.code === 'auth/email-already-in-use') {
               this.setState({text: 'That email address is already in use!'});
               Alert.alert('That email address is already in use!');
             }

             if (error.code === 'auth/invalid-email') {
               this.setState({text: 'That email address is invalid!'});
               Alert.alert('That email address is invalid!');
             }
             console.error(error);
           });
       }

    render() {
      return (
        <View style = {styles.background}>
         <Login />
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
                      onPress={
                        this.signIn
                      }>
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