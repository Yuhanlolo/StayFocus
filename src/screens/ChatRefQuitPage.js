import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { GiftedChat, Bubble, Send, MessageText, InputToolbar} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import chatScript from '../chat_reflection_scripts/chatReflectionScript_giveUp';
import ParaAPI from '../gpt_apis/Para';
import SentiAPI from '../gpt_apis/SentiGPT';
import GPTAPI from '../gpt_apis/GPT';

import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimerPage from './TimerPage';
import HomePage from './HomePage';

let flag = 'false';
let count = 0;
let ava_index = 0;


function ChatRefQuitPage({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [timeString, setTimeString] = useState('');

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

  const chat_user = {
    _id: 1,
    name: 'user',
    avatar: "https://i.328888.xyz/2022/12/27/UyZwU.png",
  }

	useFocusEffect(React.useCallback(() => {
    let timeString = route.params.timeString;
    setTimeString(timeString);

    let sentence = chatScript.openup;

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

    let set = {
      _id: Math.round(Math.random() * 1000000),
      text: sentence,
      createdAt: new Date(),
      user: chatbots[0],
    };
    msgs.push(set);

    setMessages(msgs.reverse());
    chat_history.push({character: 'chatbot', sent: sentence, ava: 0, date: new Date(),});
	}, []));

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

  function onDelete()
  {
    setMessages(previousMessages => previousMessages.filter(message => message.text !== 'Typing...'));
  }

  async function doubleAns(ans, script)
  {
    let start_log = chatScript.openup;
    if(count == 0)
    {
      start_log = chatScript.openup;
    }
    if(count == 1)
    {
      start_log = chatScript.sencond;
    }
    if(count == 2)
    {
      start_log = chatScript.third;
    }

    let answer = await GPTAPI(ans, start_log);
    let paraSen = await ParaAPI(script);
    onDelete();
    botSend(answer);
    flag = 'true';
    let index = Math.floor(Math.random()*2); 
    console.log('para:', paraSen);
    botSend(paraSen[index]);
  }

  async function endAns(ans, script)
  {
    let answer = await GPTAPI(ans, chatScript.third);
    onDelete();
    botSend(answer);
    flag = 'true';
    botSend(script);
    console.log('history: ', chat_history);
  }

  async function avaControl(sentence)
  {

    let tag = await SentiAPI(sentence);
    if(tag == 'Positive')
    {
        console.log('pos');
        ava_index = 1;
    }
    
    if(tag == 'Negative')
    {
        console.log('neg');
        ava_index = 0;
    }
    
    if(tag == 'Neutral')
    {
        console.log('neu');
        ava_index = 2;
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
    let userAns = myMessage.text;
    chat_history.push({character: 'user', sent: userAns, ava: -1, date: new Date(),});

    botSend('Typing...');
    flag = 'true';


    if(count == 2)
    {
      count = count + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      endAns(userAns, chatScript.end);
    }
    if(count == 1)
    {
      count = count + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAns(userAns, chatScript.third);
    }
    if(count == 0)
    {
      count = count + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAns(userAns, chatScript.sencond);
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

  const renderMessageText = (props) => {
    const {
      currentMessage,
    } = props;
    let judgeText = currentMessage.text;
    if(judgeText == chatScript.end || judgeText == 'Please press the buttons to make a choice.')
    {
      return (
        <View>
          <MessageText {...props}/>
          <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.buttonLeft}
              onPress={() => {
                count = 0;
                chat_history.push({character: 'user', sent: 'Yes', ava: -1, date: new Date(),});
                navigation.navigate('HomePage');
              }}>
              <Text style = {styles.buttonTextLeft}>{'   Yes   '}</Text>
            </TouchableOpacity>
            <Text>{'       '}</Text>
            <TouchableOpacity
              style={styles.buttonRight}
              onPress={() => {
                count = 0;
                chat_history.push({character: 'user', sent: 'No', ava: -1, date: new Date(),});
                DeviceEventEmitter.emit('keepFocus');
                navigation.navigate('TimerPage');
              }}>
              <Text style = {styles.buttonTextRight}>{'    No   '}</Text>
            </TouchableOpacity>
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

  const renderInputToolbar = (props) => {
    if (count > 2) {
    } else {
    return(
      <InputToolbar
      {...props}
      />
    ); 
  }
  }

  return (
  <View style = {styles.background}>
    <Text style = {styles.timerText}>{'Back to focus mode'}{' { '}{timeString}{' }'}</Text>
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={chat_user}
      textInputStyle={styles.textInput}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      renderMessageText={renderMessageText}
      renderInputToolbar={renderInputToolbar}
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

    buttonTextLeft: {
      fontFamily: "Roboto",
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 18,
    },

    buttonTextRight: {
      fontFamily: "Roboto",
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 18,
    },

    buttonRight: {
      backgroundColor: "white",
      alignItems: "center",
      height: '100%',
      borderRadius: 8.5,
      padding: 10,
      borderColor: '#B8C59E'
    },

    buttonLeft: {
      backgroundColor: "white",
      alignItems: "center",
      height: '100%',
      borderRadius: 8.5,
      padding: 10,
      borderColor: '#B8C59E'
    },

    timerText: {
      top: '4%',
      left: '5%',
      fontFamily: 'Roboto',
      fontSize: 18,
      color: 'white',
    },

  });

export default ChatRefQuitPage;