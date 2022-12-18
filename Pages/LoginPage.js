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

  //global.errorMessage_login = 'aa';

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
          const [text_5, setText_5] = useState('Log In');
          const [email, setEmail] = useState('');
          const [password, setPassword] = useState('');
          const [errorMessage_login, setErrorMessage_login] = useState('');



          // Handle user state changes
          function onAuthStateChanged(user) {
            setUser(user);
            if (initializing) setInitializing(false);
          }

          useEffect(() => {
            const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
            display = false;
            console.log('display:', display);
            return subscriber; // unsubscribe on unmount
          }, []);

           function signIn ()
                 {
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
                     .signInWithEmailAndPassword(email, password)
                     .then((data) => {
                       console.log('User account created & signed in!');
                       setErrorMessage_login('');
                       const uid = data.user.uid;
                       database()
                         .ref('users/' + uid)
                         .once('value')
                         .then(snapshot=>{console.log(snapshot.val());});

                       let item;
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
                     })
                     .catch(error => {
                       if (error.code === 'auth/email-already-in-use') {
                         console.log('That email address is already in use!');
                         //Alert.alert('That email address is already in use!');
                         //errorMessage_login = 'That email address is already in use!';
                         setErrorMessage_login('That email address is already in use!');
                       }
                       if (error.code === 'auth/invalid-email') {
                         console.log('That email address is invalid!');
                         //Alert.alert('That email address is invalid!');
                         //errorMessage_login = 'That email address is invalid!';
                         setErrorMessage_login('That email address is invalid!');
                       }
                       if (error.code === 'auth/wrong-password') {
                         console.log('That password is wrong!');
                         //errorMessage_login = 'That password is wrong!';
                         setErrorMessage_login('That password is wrong!');
                       }
                       if (error.code === 'auth/too-many-requests')
                       {
                         //errorMessage_login = 'please try again later!';
                         setErrorMessage_login('please try again later!');
                       }
                       console.error(error);
                     });
                 }

           return (
                     <View style = {styles.background}>
                      <Text style = {styles.baseText}>{title}</Text>
                      <View style = {{top:'13%'}}>
                      <Text style = {styles.comments_1}>{text_1}</Text>
                      <View style = {styles.inputContainer}>
                      <TextInput
                       style={{height: 48, borderColor: 'black', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Roboto', fontSize: 16,}}
                       onChangeText={(text) => {
                         setEmail(text);
                       }}
                     />
                      </View>
                      <Text style = {styles.comments_2}>{text_2}</Text>
                      <View style = {styles.inputContainer_}>
                      <TextInput
                       style={{top: '40%',height: 48, borderColor: 'black', backgroundColor:'white', borderWidth: 3, width:'70%', borderRadius: 10, color: 'black', fontFamily: 'Roboto', fontSize: 16,}}
                       password={true}
                       secureTextEntry={true}
                       onChangeText={(text) => {
                         setPassword(text);
                       }}
                     />
                     </View>
                      <View style = {styles.container}>
                        <Text style = {styles.helper}>{text_3}</Text>
                        <Text style = {styles.helper_} onPress={()=>{navigation.navigate('SignUpPage');}}> {"Sign Up"} </Text>
                      </View>
                      </View>
                      <View style = {{alignItems: "center", top: '35%'}}>
                      <Text style={{fontFamily: 'Roboto', fontSize: 16, color: 'red',}}>{errorMessage_login}</Text>
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
     backgroundColor: 'black',
     paddingHorizontal: 10
    },

    baseText: {
      fontSize: 35,
      top: '10%',
      left: "10%",
      fontFamily: "Roboto",
      color: '#B8C59E',
      fontWeight: 'bold',
    },

    comments_1: {
      top:'19%',
      left:'15%',
      fontFamily: "Roboto",
      color: 'white',
      fontSize: 19,
    },

    comments_2: {
      top:'36%',
      left:'15%',
      fontFamily: "Roboto",
      color: 'white',
      fontSize: 19,
    },

    container: {
      flexDirection: 'row',
      top: '25%',
      left: '33%',
    },

    inputContainer: {
      alignItems: "center",
      top: '20%',
    },

    inputContainer_: {
      alignItems: "center",
      top: '27%',
    },

    helper: {
      fontFamily: "Roboto",
      color: '#B8C59E',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 16,
    },

    helper_: {
      fontFamily: "Roboto",
      color: '#B8C59E',
      textAlign: 'center',
      textAlignVertical: 'center',
      textDecorationLine: 'underline',
      fontSize: 16,
    },

    buttonHelper: {
      backgroundColor: "#506F4C",
      borderRadius: 15,
      padding: 10,
    },

    button: {
      top: '35%',
      left:'25%',
      backgroundColor: "#506F4C",
      alignItems: "center",
      borderRadius: 23,
      padding: 10,
      width: '50%',
      borderWidth: 7,
      borderColor: 'black',
      height: '9%',
    },

    buttonText: {
      fontFamily: "Roboto",
      fontSize: 22,
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    }
  });



export default LoginPage;