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
     const [text_7, setText_7] = useState('Sign Up');
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
         let date = new Date();
         let year = date.getFullYear().toString();
         let month = (date.getMonth()+1).toString();
         let day = date.getDate().toString();
         let hour =  date.getHours().toString();
         let minute = date.getMinutes().toString();
         let second =   date.getSeconds().toString();
         if(Number(hour) <= 9)
         {
           hour = '0'+hour;
         }
         if(Number(minute) <= 9)
         {
           minute = '0'+minute;
         }
         if(Number(second) <= 9 )
         {
           second = '0'+second;
         }
         let timestamp = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
          auth()
         .createUserWithEmailAndPassword(email, password)
         .then((data) => {
           //setId(data.user.uid);
           const uid = data.user.uid;

           let dataToSave = {
               id: uid,
               email: email,
               //password: password,
               oneTimeBehavior: 'oneTimeBehavior',
               focusBreak: 0,
               focusQuit: 0,
           };
           database()
               .ref('users/' + uid)
               .update(dataToSave)
               .then(snapshot => {
                 console.log('Data updated');
                 item = database()
                   .ref('users/' + uid + '/oneTimeBehavior')
                   .push();
                 itemId = item.key;
                 let meta = [{timestamp: '0', quit: 'no'}];
                 console.log(itemId);
                  item
                   .set({timestamp: timestamp, focusDuration: '0', metadata: meta, complete: ''})
                   .then(()=>{console.log('Data updated twice');});
                   navigation.navigate('HomePage', {userId: uid, oneTimeId: itemId});
                   //
                 //  .update({time: timeSet})
                 //  .then(snapshot =>
                 //  {
                 //    database()
                 //    .ref('users/' +uid + '/oneTimeBehavior/' + timeSet)
                 //    .update({oneFocusTime: 0, oneQuitTry: 0, oneQuit: 0,})
                 //    .then(snapshot => {console.log('Data updated twice');});
                 //  }
                 //  );
                 //  .update({oneFocusTime: 0, oneQuitTry: 0, oneQuit: 0,})
                 //  .then(snapshot => {console.log('Data updated twice');})
               })
               .catch(error=>{reject(error);});
           //console.log(uid);
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
          style={{height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Roboto'}}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
         </View>
         <Text style = {styles.comments_2}>{text_2}</Text>
         <View style = {styles.inputContainer}>
         <TextInput
          style={{top: '20%', height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Roboto'}}
          onChangeText={(text) => {
            setUserName(text);
          }}
        />
        </View>

        <Text style = {styles.comments_3}>{text_3}</Text>
                 <View style = {styles.inputContainer}>
                 <TextInput
                  style={{top: '40%', height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Roboto'}}
                  password={true}
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                />
                </View>

         <Text style = {styles.comments_4}>{text_4}</Text>
                  <View style = {styles.inputContainer}>
                  <TextInput
                   style={{top: '60%', height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Roboto'}}
                   password={true}
                   onChangeText={(text) => {
                     setConfirmPassword(text);
                   }}
                 />
                 </View>

         <View style = {styles.container}>
           <Text style = {styles.helper}>{text_5}</Text>
           <Text style = {styles.helper_} onPress={()=>{navigation.navigate('LoginPage');}}> {"Log In"} </Text>
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
     backgroundColor: 'black',
     paddingHorizontal: 10
    },

    baseText: {
      fontSize: 30,
      top: '10%',
      left: "10%",
      fontFamily: "Roboto",
      color: '#B8C59E',
    },

    comments_1: {
      top:'16%',
      left:'15%',
      fontFamily: "Roboto",
      color: 'white',
    },

    comments_2: {
      top:'17%',
      left:'15%',
      fontFamily: "Roboto",
      color: 'white',
    },

   comments_3: {
      top:'18%',
      left:'15%',
      fontFamily: "Roboto",
      color: 'white',
    },

   comments_4: {
      top:'19%',
      left:'15%',
      fontFamily: "Roboto",
      color: 'white',
    },

    container: {
      flexDirection: 'row',
      top: '42%',
      left: '7.5%',
    },

    inputContainer: {
      alignItems: "center",
      top: '16%',
    },

    helper: {
      fontFamily: "Roboto",
      color: '#B8C59E',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    helper_: {
      fontFamily: "Roboto",
      color: '#B8C59E',
      textAlign: 'center',
      textAlignVertical: 'center',
      textDecorationLine: 'underline',
    },

    buttonHelper: {
      backgroundColor: "#506F4C",
      borderRadius: 15,
      padding: 10,
    },

    button: {
      top: '25%',
      left:'25%',
      backgroundColor: "#506F4C",
      alignItems: "center",
      borderRadius: 23,
      padding: 10,
      width: '50%',
      borderWidth: 7,
      borderColor: 'black'
    },

    buttonText: {
      fontFamily: "Roboto",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    }
  });

export default SignUpPage;