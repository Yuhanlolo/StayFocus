import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GiftedChat, Bubble, Send, MessageText } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import chatScript from '../ChatScripts/chatScript';
import ParaAPI from '../API/Para';

import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import QuitPage from './ChatQuit';

const chat_user = {
  _id: 1,
  name: 'user',
  avatar: "https://i.328888.xyz/2022/12/27/UyZwU.png",
}

const chatbots = [{
  _id: 2,
  name: 'chatbot',
  avatar: "https://i.328888.xyz/2022/12/27/Uyixv.png",
},
{
  _id: 2,
  name: 'chatbot',
  avatar: "https://s1.ax1x.com/2022/12/31/pS93lz6.png",
},
{
  _id: 2,
  name: 'chatbot',
  avatar: "https://img1.imgtp.com/2023/02/04/jjyrMHT5.png",
}]

let flag = 'false';
let select = 'true';
let ava_index = 1;

function SetTimePage({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [timeSet, setTimeSet] = useState(0);
  const [userId, setUserId] = useState('');
  const [oneTimeId, setOneTimeId] = useState('');



  useFocusEffect(React.useCallback(() => {
    let notice = 'Please enter or select your focus time.';
    let sentence = chatScript.set;

    let msgs = new Array();
    for(i=0; i<chat_history.length; i++)
    {
      if(chat_history[i].character == 'chatbot')
      {
        let stamp = {
          _id: Math.round(Math.random() * 1000000),
          text: chat_history[i].sent,
          createdAt: chat_history[i].date,
          user: chatbots[chat_history[i].ava],
        };
        msgs.push(stamp);
      }
      if(chat_history[i].character == 'user')
      {
        let stamp = {
          _id: Math.round(Math.random() * 1000000),
          text: chat_history[i].sent,
          createdAt: chat_history[i].date,
          user: chat_user,
        };
        msgs.push(stamp);
      }
    }

    console.log('****history:', chat_history);

    msgs.push({
      _id: Math.round(Math.random() * 1000000),
      text: sentence,
      createdAt: new Date(),
      user: chatbots[1],
    });
    msgs.push({
      _id: 1,
      text: notice,
      createdAt: new Date(),
      user: chatbots[1],
    });

    setMessages(msgs.reverse());
    chat_history.push({character: 'chatbot', sent: notice, ava: 1, date: new Date(),});
    chat_history.push({character: 'chatbot', sent: sentence, ava: 1, date: new Date(),});
	}, []));

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
        if(sentence != 'Typing...')
        {
          chat_history.push({character: 'chatbot', sent: sentence, ava: ava_index, date: new Date(),});
        }
        let botMessage = {
          _id: Math.round(Math.random() * 1000000),
          text: sentence,
          createdAt: new Date(),
          user: chatbots[ava_index],
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
    chat_history.push({character: 'user', sent: myMessage.text, ava: -1, date: new Date()});
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
          navigation.navigate('QuitPage');
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
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(25); chat_history.push({character: 'user', sent: '25 mins', ava: -1, date: new Date()}); navigation.navigate('QuitPage');}}>{'            25 mins             '}</Text>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(50); chat_history.push({character: 'user', sent: '50 mins', ava: -1, date: new Date()}); navigation.navigate('QuitPage');}}>{'            50 mins             '}</Text>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(75); chat_history.push({character: 'user', sent: '75 mins', ava: -1, date: new Date()}); navigation.navigate('QuitPage');}}>{'            75 mins             '}</Text>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(100); chat_history.push({character: 'user', sent: '100 mins', ava: -1, date: new Date()}); navigation.navigate('QuitPage');}}>{'            100 mins           '}</Text>
            <Text style = {styles.dropdownText} onPress = {() => {setTimeSet(125); chat_history.push({character: 'user', sent: '125 mins', ava: -1, date: new Date()}); navigation.navigate('QuitPage');}}>{'            125 mins           '}</Text>
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