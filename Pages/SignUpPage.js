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
  Alert
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
import database from '@react-native-firebase/database';

import HomePage from './HomePage';
import LoginPage from './LoginPage';

function SignUpPage({ navigation })
  {
    // Set an initializing state whilst Firebase connects
     const [initializing, setInitializing] = useState(true);
     const [user, setUser] = useState();
     const [title, setTitle] = useState('Sign up');
     const [text, setText] = useState('aaa');
     const [text_, setText_] = useState('');
     const [text_1, setText_1] = useState('E-mail :');
     const [text_2, setText_2] = useState('User Name :');
     const [text_3, setText_3] = useState('Password :');
     const [text_4, setText_4] = useState('Confirm Password :');
     const [text_5, setText_5] = useState('Already a user?  ');
     const [text_6, setText_6] = useState('Log in');
     const [text_7, setText_7] = useState('Start your focused time Now!');
     const [email, setEmail] = useState('');
     const [userName, setUserName] = useState('');
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');

    // Handle user state changes
     function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
          }

     useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
          }, []);

     function storeInfo ()
     {
       return new Promise(function(resolve,reject)
       {
          let dataToSave = {
          id: user.uid,
          email: user.email,
          password: password,
          focusBreak: 0,
          focusQuit: 0,
          };
       database()
          .ref('users/' + user.uid)
          .update(dataToSave)
          .then(snapshot => {console.log('Data updated');})
          .catch(error=>{reject(error);});
       })
     }

     createUser = () =>
     {
         return new Promise(function(resolve,reject){
          auth()
         .createUserWithEmailAndPassword(email, password)
         .then((data) => {
           //setId(data.user.uid);
           const uid = data.user.uid;
           let dataToSave = {
               id: uid,
               email: email,
               password: password,
               focusBreak: 0,
               focusQuit: 0,
           };
           database()
               .ref('users/' + uid)
               .update(dataToSave)
               .then(snapshot => {console.log('Data updated');})
               .catch(error=>{reject(error);});
           //console.log(uid);
           navigation.navigate('HomePage', {userId: uid});
           resolve('User account created & signed in!');
         })
         .catch(error => {
           if (error.code === 'auth/email-already-in-use') {
             Alert.alert('That email address is already in use!');
           }

           if (error.code === 'auth/invalid-email') {
             Alert.alert('That email address is invalid!');
           }
           reject(error);
         });
         })
     }

       return (
        <View style = {styles.background}>
         <Text style = {styles.baseText}>{title}</Text>
         <Text style = {styles.comments_1}>{text_1}</Text>
         <View style = {styles.inputContainer}>
         <TextInput
          style={{height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
         </View>
         <Text style = {styles.comments_2}>{text_2}</Text>
         <View style = {styles.inputContainer}>
         <TextInput
          style={{top: '20%', height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            setUserName(text);
          }}
        />
        </View>

        <Text style = {styles.comments_3}>{text_3}</Text>
                 <View style = {styles.inputContainer}>
                 <TextInput
                  style={{top: '40%', height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
                  password={true}
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                />
                </View>

         <Text style = {styles.comments_4}>{text_4}</Text>
                  <View style = {styles.inputContainer}>
                  <TextInput
                   style={{top: '60%', height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
                   password={true}
                   onChangeText={(text) => {
                     setConfirmPassword(text);
                   }}
                 />
                 </View>

         <View style = {styles.container}>
           <Text style = {styles.helper}>{text_5}</Text>
            <TouchableOpacity
                      style={styles.buttonHelper}
                      onPress={() => {
                        navigation.navigate('LoginPage');
                      }}>
                      <Text style = {styles.buttonText}>{text_6}</Text>
            </TouchableOpacity>
         </View>
            <TouchableOpacity
                      style={styles.button}
                      onPress={
                        createUser
                        //()=>{navigation.navigate('HomePage',{userId: 'a'});}
                       }>
                      <Text style = {styles.buttonText}>{text_7}</Text>
            </TouchableOpacity>
        </View>
      );
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
      top:'16%',
      left:'15%',
      fontFamily: "Cochin",
      color: 'white',
    },

    comments_2: {
      top:'17%',
      left:'15%',
      fontFamily: "Cochin",
      color: 'white',
    },

   comments_3: {
      top:'18%',
      left:'15%',
      fontFamily: "Cochin",
      color: 'white',
    },

   comments_4: {
      top:'19%',
      left:'15%',
      fontFamily: "Cochin",
      color: 'white',
    },

    container: {
      flexDirection: 'row',
      top: '38%',
      left: '9.5%',
    },

    inputContainer: {
      alignItems: "center",
      top: '16%',
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
      top: '25%',
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

export default SignUpPage;