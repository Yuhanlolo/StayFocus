  import React, { useState, useEffect, Component } from 'react';
  import auth from '@react-native-firebase/auth';
  import database from '@react-native-firebase/database';
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

  import HomePage from './HomePage';
  import SignUpPage from './SignUpPage';

  function LoginPage({ navigation })
     {
          // Set an initializing state whilst Firebase connects
          const [initializing, setInitializing] = useState(true);
          const [user, setUser] = useState();
          const [title, setTitle] = useState('Log In');
          const [text, setText] = useState('aaa');
          const [text_, setText_] = useState('');
          const [text_1, setText_1] = useState('E-mail :');
          const [text_2, setText_2] = useState('Password :');
          const [text_3, setText_3] = useState('Not a user yet?  ');
          const [text_4, setText_4] = useState('Sign up');
          const [text_5, setText_5] = useState('Start your focused time Now!');
          const [email, setEmail] = useState('');
          const [password, setPassword] = useState('');



          // Handle user state changes
          function onAuthStateChanged(user) {
            setUser(user);
            if (initializing) setInitializing(false);
          }

          useEffect(() => {
            const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            return subscriber; // unsubscribe on unmount
          }, []);

           function signIn ()
                 {
                    auth()
                     .signInWithEmailAndPassword(email, password)
                     .then((data) => {
                       console.log('User account created & signed in!');
                       const uid = data.user.uid;
                       database()
                         .ref('users/' + uid)
                         .once('value')
                         .then(snapshot=>{console.log(snapshot.val());});

                       item = database()
                       .ref('users/' + uid + '/oneTimeBehavior')
                       .push();
                       itemId = item.key;
                       console.log(itemId);
                       item
                       .set({oneFocusTime: 0, oneQuitTry: 0, oneQuit: 0,})
                       .then(()=>{console.log('Data updated twice');});
                       navigation.navigate('HomePage', {userId: uid, oneTimeId: itemId});
                     })
                     .catch(error => {
                       if (error.code === 'auth/email-already-in-use') {
                         console.log('That email address is already in use!');
                       }
                       if (error.code === 'auth/invalid-email') {
                         console.log('That email address is invalid!');
                       }
                       console.error(error);
                     });
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
                       style={{top: '50%',height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
                       password={true}
                       onChangeText={(text) => {
                         setPassword(text);
                       }}
                     />
                     </View>
                      <View style = {styles.container}>
                        <Text style = {styles.helper}>{text_3}</Text>
                         <TouchableOpacity
                                   style={styles.buttonHelper}
                                   onPress={() => {
                                            navigation.navigate('SignUpPage');
                                           }}>
                                   <Text style = {styles.buttonText}>{text_4}</Text>
                         </TouchableOpacity>
                      </View>
                         <TouchableOpacity
                                   style={styles.button}
                                   onPress={
                                     signIn
                                   }>
                                   <Text style = {styles.buttonText}>{text_5}</Text>
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
      top: '45%',
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