import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GiftedChat, Bubble, Send, MessageText } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import chatScript from '../ChatScripts/chatScript';
import ParaAPI from '../API/Para';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimerPage from './ChatTimer';

const chat_user = {
  _id: 1,
  name: 'user',
  avatar: "https://i.328888.xyz/2022/12/27/UyZwU.png",
}

const chatbot = {
  _id: 2,
  name: 'chatbot',
  avatar: "https://s1.ax1x.com/2022/12/31/pS93lz6.png",
}

global.flag = 'false';
global.select = 'true';

function SetTimePage({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [timeSet, setTimeSet] = useState(0);
  const [userId, setUserId] = useState('');
  const [oneTimeId, setOneTimeId] = useState('');

  useEffect(() => {
      let sentence = chatScript.set;
      setMessages([
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'Please enter or select your focus time.',
          createdAt: new Date(),
          user: chatbot,
        },
        {
          _id: 1,
          text: sentence,
          createdAt: new Date(),
          user: chatbot,
        },
      ]);

      let uid = route.params.userId;
      let oneTime = route.params.oneTimeId;
      setUserId(uid);
      setOneTimeId(oneTime);
  }, [])

  function extractTime (txt)
  {
    let time = txt.replace(/[^\d]/g,'');
    if(time == '')
    {
      return 'NAN';
    }
    if(time != '')
    {
      return time;
    }
  }

  function botSend(txt)
  {
     if(flag == 'true')
     {
        let sentence = txt;
        let botMessage = {
          _id: Math.round(Math.random() * 1000000),
          text: sentence,
          createdAt: new Date(),
          user: chatbot,
          };
        setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));
        flag = 'false';
      }
  }

  const onSend = useCallback((messageArray) => {
    const message = messageArray[0];
    const myMessage = {
      _id: Math.round(Math.random() * 1000000),
      ...message,
      createdAt: new Date(),
      user: chat_user,
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMessage));
    flag = 'true';
    select = 'false';
    if(extractTime(myMessage.text) == 'NAN')
    {
      botSend("Sorry, I don't understand. Please input Arabic numbers to set your focus time.");
    }
    if(extractTime(myMessage.text) != 'NAN')
    {
      let timeNum = Number(extractTime(myMessage.text));
      if(!isNaN(timeNum))
      {
        if(timeNum < 25)
        {
          botSend("Please enter more than 25 minutes.");
        }
        if(timeNum > 125)
        {
          botSend("Please enter less than 125 minutes.");
        }
        if(timeNum >= 25 && timeNum <= 125)
        {
          setTimeSet(timeNum);
          navigation.navigate('TimerPage', {userId: userId, oneTimeId: oneTimeId, timeSet: timeNum, minSet: timeNum, secSet: 0});
        }
      }
      if(isNaN(timeNum))
      {
        botSend("Sorry, I don't understand. Please input Arabic numbers to set your focus time.");
      }
    }
  }, [])

  const renderBubble = (props) =>
  {
      return(
        <Bubble
          {...props}
          wrapperStyle = {{
            left: {
              backgroundColor: '#506F4C',
            },
            right: {
              backgroundColor: 'gray',
            }
          }}
    
          textStyle = {{
            left: {
              fontFamily: 'Roboto',
              fontSize: 18,
              color: 'white',
            },
            right: {
              fontFamily: 'Roboto',
              fontSize: 18,
              color: 'black',
            }
          }}
        />
      )
  }

  const renderMessageText = (props) => {
    const {
      currentMessage,
    } = props;
    let judgeText = currentMessage.text;
    if(judgeText == 'Please enter or select your focus time.')
    {
      return (
        <View>
          <MessageText {...props}/>
          <View style = {styles.dropdown}>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(25); navigation.navigate('TimerPage', {userId: userId, oneTimeId: oneTimeId, timeSet: 25, minSet: 25, secSet: 0,});}}>{'            25 mins             '}</Text>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(50); navigation.navigate('TimerPage', {userId: userId, oneTimeId: oneTimeId, timeSet: 50, minSet: 50, secSet: 0,});}}>{'            50 mins             '}</Text>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(75); navigation.navigate('TimerPage', {userId: userId, oneTimeId: oneTimeId, timeSet: 75, minSet: 75, secSet: 0,});}}>{'            75 mins             '}</Text>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(100); navigation.navigate('TimerPage', {userId: userId, oneTimeId: oneTimeId, timeSet: 100, minSet: 100, secSet: 0,});}}>{'            100 mins           '}</Text>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(125); navigation.navigate('TimerPage', {userId: userId, oneTimeId: oneTimeId, timeSet: 125, minSet: 125, secSet: 0,});}}>{'            125 mins           '}</Text>
          </View>
        </View>
      );
    }
    else
    {
      return(
        <View>
          <MessageText {...props}/>
        </View>
      );
    }
  };

  const renderSend = (props) =>
  {
    return(
    <Send {...props}>
      <View>
        <Icon
            size={25}
            name="arrow-up"
            backgroundColor="white"
            style={{marginBottom: 10, marginRight: 5,}}
            color= "black"
        />
      </View>
    </Send>
    )
  }

  return (
  <View style = {styles.background}>
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={chat_user}
      textInputStyle={styles.textInput}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      renderMessageText={renderMessageText}
    />
  </View>
  )
}

  const styles = StyleSheet.create({

    background: {
     flex: 1,
     backgroundColor: 'black',
     paddingHorizontal: 10
    },

    textInput: {
      color: 'black',
      borderRadius: 5,
    },

    dropdown: {
      color: 'white',
      width: '100%',
      borderRadius: 8,
    },

    dropdownText: {
      fontSize: 18,
      color: 'white',
      fontFamily: 'Roboto',
      textAlign: 'center',
      textAlignVertical: 'center',
      textDecorationLine: 'underline',
    },

  });

export default SetTimePage;