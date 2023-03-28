import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, LogBox, BackHandler } from 'react-native';
import { GiftedChat, Bubble, Send, MessageText, InputToolbar} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import chatScript from '../chat_reflection_scripts/chatReflectionScript_congrats';
import congrats_default from '../default_scripts/finish_script';
import {useSessionStore, saveSession} from '../api';
import {dateToString, shuffleArray} from '../helpers/utilities';

import ParaAPI from '../gpt_apis/Para';
import SentiAPI from '../gpt_apis/SentiGPT';
import GPTAPI from '../gpt_apis/Completion';

import { congrats } from '../chat_reflection_scripts/chatReflectionScript_congrats';
import {congratsDefaultNew} from '../default_scripts/new_default_scripts';

import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from './HomePage';

//In this page we need to upload all the chat records to the database(firestore)
//the location where we can call the function is in onpress method in "back to home" button

let flag = 'false';
let userControl = 'true';
let count_finish = 0;
let ava_index = 1;


function ChatRefFinishPage({ route, navigation }) {
  const [messages, setMessages] = useState([]);

  const saveChatPrompts = useSessionStore(
    state => state.saveChatPrompts,
  );

  const minutes = useSessionStore(state => state.focusDurationMinutes);

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

  let congrat_prompts = [congrats.rand_1, congrats.rand_2, congrats.rand_3, congrats.rand_4, congrats.rand_5, congrats.rand_6];
  shuffleArray(congrat_prompts);
  let congrat_questions = [congrat_prompts[0], congrat_prompts[1], congrat_prompts[2], congrat_prompts[3], congrat_prompts[4]];

  let congrat_default  = [congratsDefaultNew.rand_1, congratsDefaultNew.rand_2, congratsDefaultNew.rand_3, congratsDefaultNew.rand_4, congratsDefaultNew.rand_5];

  useFocusEffect(React.useCallback(() => {
    let sent = congrats.fixed;
    let sentence = sent.replace('X', minutes.toString());

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
      user: chatbots[1],
    };

    msgs.push(set);

    setMessages(msgs.reverse());
    chat_history.push({character: 'chatbot', sent: sentence, ava: 1, date: dateToString(new Date()),});
    once_history.push({character: 'chatbot', sent: sentence, ava: 1, date: dateToString(new Date()),});
	}, []));

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  function question_process(arr)
  {
    res = [arr[0][0], arr[1][0], arr[2][0], arr[3][0], arr[4][0]]; 
    return res;
  }


  function botSend(txt)
  {
     if(flag == 'true')
     {
        let sentence = txt;
        if(sentence != 'Typing...')
        {
          chat_history.push({character: 'chatbot', sent: sentence, ava: ava_index, date: dateToString(new Date()),});
          once_history.push({character: 'chatbot', sent: sentence, ava: ava_index, date: dateToString(new Date()),});
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
    let answer = await new Promise(async (resolve, reject) => {
      let apires;
      setTimeout(() => {
        if (apires) {
          resolve(apires);
        } else {
          resolve(congrats_default.question);
        }
      }, 10000)
      apires = await GPTAPI(ans, congrats.fixed);
      resolve(apires);

    })
    //let paraSen = await ParaAPI(script);
    onDelete();
    botSend(answer);
    flag = 'true';
    let index = Math.floor(Math.random()*2); 
    //console.log('para:', paraSen);
    //botSend(paraSen[index]);
    botSend(script);
    userControl = 'true';
  }

  async function doubleAnsCompletion(ans, script, num)
  {
    let order = Math.floor(Math.random()*num);
    let default_answer = congrat_default[order]; 
    congrat_default = congrat_default.filter(item => item != default_answer)

    let answer = await new Promise(async (resolve, reject) => {
      let apires;
      setTimeout(() => {
        if (apires) {
          resolve(apires);
        } else {
          resolve(default_answer);
        }
      }, 10000)
      apires = await GPTAPI(ans, congrats.fixed);
      resolve(apires);

    })
    onDelete();
    botSend(answer);
    userControl = 'true';
  }

  async function endAns(ans, script)
  {
    let answer = await new Promise(async (resolve, reject) => {
      let apires;
      setTimeout(() => {
        if (apires) {
          resolve(apires);
        } else {
          resolve(congrats_default.end);
        }
      }, 10000)
      apires = await GPTAPI(ans, congrats.fixed);
      resolve(apires);

    })
    onDelete();
    botSend(answer);
    flag = 'true';
    botSend(script);
    console.log('history: ', chat_history);
    userControl = 'true';
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

    let questions = question_process(congrat_questions);

    flag = 'true';
    let userAns = myMessage.text;
    chat_history.push({character: 'user', sent: userAns, ava: -1, date: dateToString(new Date()),});
    once_history.push({character: 'user', sent: userAns, ava: -1, date: dateToString(new Date()),});

    if(userControl == 'true')
    {
      botSend('Typing...');
    }
  
    flag = 'true';

    if(count_finish == 5 && userControl == 'true')
    {
      userControl = 'false';
      count_finish = count_finish + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      //endAns(userAns, congrats.end);
      onDelete();
      botSend(congrats.end);
    }
    if(count_finish == 4 && userControl == 'true')
    {
      userControl = 'false';
      count_finish = count_finish + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAnsCompletion(userAns, questions[0], 1);
    }
    if(count_finish == 3 && userControl == 'true')
    {
      userControl = 'false';
      count_finish = count_finish + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAnsCompletion(userAns, questions[1], 2);
    }
    if(count_finish == 2 && userControl == 'true')
    {
      userControl = 'false';
      count_finish = count_finish + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAnsCompletion(userAns, questions[2], 3);
    }
    if(count_finish == 1 && userControl == 'true')
    {
      userControl = 'false';
      count_finish = count_finish + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAnsCompletion(userAns, questions[3], 4);
    }
    if(count_finish == 0 && userControl == 'true')
    {
      userControl = 'false';
      count_finish = count_finish + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAnsCompletion(userAns, questions[4], 5);
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

  //need a function like "uploadChatHistory(chat_history)" in the onPress function in "back to home" button
  const renderMessageText = (props) => {
    const {
      currentMessage,
    } = props;
    let judgeText = currentMessage.text;
    if(judgeText == congrats.end || judgeText == 'Please press the buttons to make a choice.')
    {
      return (
        <View>
          <MessageText {...props}/>
          <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                userControl = 'true';
                count_finish = 0;
                chat_history.push({character: 'user', sent: 'Back to home.', ava: -1, date: dateToString(new Date()),});
                once_history.push({character: 'user', sent: 'Back to home.', ava: -1, date: dateToString(new Date()),});
                saveChatPrompts(once_history);
                saveSession();
                navigation.navigate('HomePage');
              }}>
              <Text style = {styles.buttonText}>{'Save your focus log'}</Text>
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
    if (count_finish > 5) {
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

    buttonText: {
      fontFamily: "Roboto",
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 15,
    },

    button: {
      backgroundColor: "white",
      alignItems: "center",
      height: '100%',
      width: '70%',
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

export default ChatRefFinishPage;