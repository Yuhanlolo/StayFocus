import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, DeviceEventEmitter, BackHandler } from 'react-native';
import { GiftedChat, Bubble, Send, MessageText, InputToolbar} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import chatScript from '../chat_reflection_scripts/chatReflectionScript_giveUp';
import giveUp_default from '../default_scripts/giveup_script';
import {useSessionStore, saveSession} from '../api';

import {dateToString, shuffleArray} from '../helpers/utilities';

import ParaAPI from '../gpt_apis/Para';
import SentiAPI from '../gpt_apis/SentiGPT';
import GPTAPI from '../gpt_apis/GPT';

import { giveUpEarly } from '../chat_reflection_scripts/chatReflectionScript_giveUp';
import { giveUpNormal } from '../chat_reflection_scripts/chatReflectionScript_giveUp';
import { giveUpClose2Goal } from '../chat_reflection_scripts/chatReflectionScript_giveUp';
import { giveupDefault } from '../default_scripts/new_default_scripts';

import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimerPage from './TimerPage';
import HomePage from './HomePage';

//In this page we need to upload all the chat records to the database(firestore) if the user choose to leave the focus mode(give up)
//the location where we can call the function is in onpress method in "Yes" button

let flag = 'false';
let count = 0;
let ava_index = 0;
let userControl = 'true';
let mode = '';
let focusTime = 0;
let tag = 0; //if the question need to be answer twice the tag will be 1, else 0;
let question_tmp = giveUpNormal.fixed;

function ChatRefQuitPage({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [timeString, setTimeString] = useState('');

  const saveChatPrompts = useSessionStore(
    state => state.saveChatPrompts,
  );

  const saveGiveUpAttempt = useSessionStore(state => state.saveGiveUpAttempt);

  const minutes = useSessionStore(state => state.focusDurationMinutes);

  const saveCompletedMinutes = useSessionStore(
    state => state.saveCompletedMinutes,
  );

  const elapsedMinutes = () =>
  Math.ceil(minutes - Number(timeString.substring(0,2)));

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

  let early_prompts = [giveUpEarly.rand_1, giveUpEarly.rand_2, giveUpEarly.rand_3, giveUpEarly.rand_4, giveUpEarly.rand_5, giveUpEarly.rand_6];
  shuffleArray(early_prompts);
  let early_questions = [early_prompts[0], early_prompts[1], early_prompts[2], early_prompts[3]];

  let close_prompts = [giveUpClose2Goal.rand_1, giveUpClose2Goal.rand_2, giveUpClose2Goal.rand_3, giveUpClose2Goal.rand_4, giveUpClose2Goal.rand_5, giveUpClose2Goal.rand_6];
  shuffleArray(close_prompts);
  let close_questions = [close_prompts[0], close_prompts[1], close_prompts[2], close_prompts[3]];

  let normal_prompts = [giveUpNormal.rand_1, giveUpNormal.rand_2, giveUpNormal.rand_3, giveUpNormal.rand_4, giveUpNormal.rand_5, giveUpNormal.rand_6];
  shuffleArray(normal_prompts);
  let normal_questions = [normal_prompts[0], normal_prompts[1], normal_prompts[2], normal_prompts[3]];

  let default_answers = [giveupDefault.rand_1, giveupDefault.rand_2, giveupDefault.rand_3, giveupDefault.rand_4, giveupDefault.rand_5];

	useFocusEffect(React.useCallback(() => {
    let timeString = route.params.timeString;
    setTimeString(timeString);

    focusTime = Math.ceil(minutes - Number(timeString.substring(0,2)));
    let sentence = '';

    if(focusTime < 10)
    {
      mode = 'early';
      sentence = giveUpEarly.fixed;
    }
    if(focusTime >= 10 && focusTime < (minutes - 10))
    {
      mode = 'normal';
      sentence = giveUpNormal.fixed;
    }
    if(focusTime >= (minutes - 10))
    {
      mode = 'close';
      sentence = giveUpClose2Goal.fixed;
    }

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
    chat_history.push({character: 'chatbot', sent: sentence, ava: 0, date: dateToString(new Date()),});
    once_history.push({character: 'chatbot', sent: sentence, ava: 0, date: dateToString(new Date()),});
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
    res = [arr[0][0], arr[1][0], arr[2][0], arr[3][0]]; 
    return res;
  }

  function botSend(txt)
  {
     if(flag == 'true')
     {
        let sentence = txt;
        if(sentence != 'Typing...')
        {
          if(count > 3)
          {
            pureText = giveUpNormal.end + ' ';
            chat_history.push({character: 'chatbot', sent: pureText, ava: ava_index, date: dateToString(new Date()),});
            once_history.push({character: 'chatbot', sent: pureText, ava: ava_index, date: dateToString(new Date()),});
          }
          else
          {
            chat_history.push({character: 'chatbot', sent: sentence, ava: ava_index, date: dateToString(new Date()),});
            once_history.push({character: 'chatbot', sent: sentence, ava: ava_index, date: dateToString(new Date()),});
          }
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
    let start_log = giveUpNormal.fixed;
    let default_log  = giveUp_default.end;
    let index = Math.floor(Math.random()*5);
    let default_answer = default_answers[index]; 

    let answer = await new Promise(async (resolve, reject) => {
      let apires;
      setTimeout(() => {
        if (apires) {
          resolve(apires);
        } else {
          resolve(default_answer);
        }
      }, 10000)
      apires = await GPTAPI(ans, question_tmp);
      resolve(apires);

    })
    onDelete();
    botSend(answer);

    //let paraSen = await ParaAPI(script);
    flag = 'true';
    userControl = 'true';
    //console.log('para:', paraSen);
    //botSend(paraSen[index]);
    botSend(script);
  }

  async function endAns(ans, script)
  {
    let start_log = giveUpNormal.fixed;

    let answer = await new Promise(async (resolve, reject) => {
      let apires;
      setTimeout(() => {
        if (apires) {
          resolve(apires);
        } else {
          resolve(giveUp_default.end);
        }
      }, 10000)
      apires = await GPTAPI(ans, start_log);
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
    console.log('count: ', count);
    console.log('userControl: ', userControl);
    const message = messageArray[0];
    const myMessage = {
      _id: Math.round(Math.random() * 1000000),
      ...message,
      createdAt: new Date(),
      user: chat_user,
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMessage));

    let questions = [];
    if(mode == 'early')
    {
      questions = question_process(early_questions);
    }
    if(mode == 'normal')
    {
      questions = question_process(normal_questions);
    }
    if(mode == 'close')
    {
      questions = question_process(close_questions);
    }

    flag = 'true';
    let userAns = myMessage.text;
    chat_history.push({character: 'user', sent: userAns, ava: -1, date: dateToString(new Date()),});
    once_history.push({character: 'user', sent: userAns, ava: -1, date: dateToString(new Date()),});
    
    if(userControl == 'true')
    {
      botSend('Typing...');
    }

    flag = 'true';


    if(count == 3 && tag != 1 && userControl == 'true')
    {
      userControl = 'false';
      count = count + 1;
      console.log('last question: ', question_tmp);
      avaControl(userAns);
      console.log('index:', ava_index);
      //endAns(userAns, giveUpNormal.end);
      onDelete();
      botSend(giveUpNormal.end);
    }
    if(count == 2 && tag != 1 && userControl == 'true')
    {
      let checkSentence = questions[0];
      checkSentence = checkSentence.replace('X', focusTime);

      if(checkSentence == 'What was your original plan for this focus session?')
      {
        tag = 0;
      }
      console.log('last question: ', question_tmp);
      question_tmp = checkSentence;
      userControl = 'false';
      count = count + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAns(userAns, checkSentence);
    }
    if(count == 1 && tag != 1 && userControl == 'true')
    {
      let checkSentence = questions[1];
      checkSentence = checkSentence.replace('X', focusTime);

      if(checkSentence == 'What was your original plan for this focus session?')
      {
        tag = 0;
      }
      console.log('last question: ', question_tmp);
      question_tmp = checkSentence;
      userControl = 'false';
      count = count + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAns(userAns, checkSentence);
    }
    if(count == 0 && tag != 1 && userControl == 'true')
    {
      let checkSentence = questions[2];
      checkSentence = checkSentence.replace('X', focusTime);

      if(checkSentence == 'What was your original plan for this focus session?')
      {
        tag = 0;
      }
      console.log('last question: ', question_tmp);
      question_tmp = checkSentence;
      userControl = 'false';
      count = count + 1;
      avaControl(userAns);
      console.log('index:', ava_index);
      doubleAns(userAns, checkSentence);
    }
    if(tag == 2 && userControl == 'true')
    {
      userControl = 'false';
      let followedQues = 'Great Plan! How did it go?';
      console.log('last question: ', question_tmp);
      question_tmp = followedQues;
      avaControl(userAns);
      doubleAns(userAns, followedQues);
      tag = 0;
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

  //need a function like "uploadChatHistory(chat_history)" in the onPress function in "Yes" button

  const renderMessageText = (props) => {
    const {
      currentMessage,
    } = props;
    let judgeText = currentMessage.text;
    if(judgeText == giveUpNormal.end || judgeText == 'Please press the buttons to make a choice.')
    {
      return (
        <View>
          <MessageText {...props}/>
          <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.buttonLeft}
              onPress={() => {
                count = 0;
                userControl = 'true';
                question_tmp = giveUpNormal.fixed;
                chat_history.push({character: 'user', sent: 'Yes.', ava: -1, date: dateToString(new Date()),});
                once_history.push({character: 'user', sent: 'Yes.', ava: -1, date: dateToString(new Date()),});
                saveGiveUpAttempt(false);
                DeviceEventEmitter.emit('keepFocus');
                navigation.navigate('TimerPage');
              }}>
              <Text style = {styles.buttonTextLeft}>{'   Yes   '}</Text>
            </TouchableOpacity>
            <Text>{'       '}</Text>
            <TouchableOpacity
              style={styles.buttonRight}
              onPress={() => {
                count = 0;
                userControl = 'true';
                question_tmp = giveUpNormal.fixed;
                chat_history.push({character: 'user', sent: 'No.', ava: -1, date: dateToString(new Date()),});
                once_history.push({character: 'user', sent: 'No.', ava: -1, date: dateToString(new Date()),});
                saveChatPrompts(once_history);
                saveGiveUpAttempt(true);
                saveCompletedMinutes(elapsedMinutes());
                saveSession();
                navigation.navigate('HomePage');
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
    if (count > 3) {
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
    <View style = {{flexDirection: 'row', flex: 1}}>
      <TouchableOpacity
        style = {styles.button}
        onPress={()=>{
          count = 0;
          userControl = 'true';
          question_tmp = giveUpNormal.fixed;
          chat_history.push({character: 'user', sent: 'Back to focus mode', ava: -1, date: dateToString(new Date()),});
          once_history.push({character: 'user', sent: 'Back to focus mode', ava: -1, date: dateToString(new Date()),});
          saveGiveUpAttempt(false);
          DeviceEventEmitter.emit('keepFocus');
          navigation.navigate('TimerPage');
        }}>
        <Text style = {styles.timerText}>{'Back to focus'}{' { '}{timeString}{' }'}</Text>
      </TouchableOpacity>
      <Text>{'   '}</Text>
      <TouchableOpacity
        style = {count>1 ? styles.exitButtonPlus : styles.exitButton}
        onPress={()=>{
          if(count > 1)
          {
            count = 0;
            userControl = 'true';
            question_tmp = giveUpNormal.fixed;
            chat_history.push({character: 'user', sent: 'End the session.', ava: -1, date: dateToString(new Date()),});
            once_history.push({character: 'user', sent: 'End the session.', ava: -1, date: dateToString(new Date()),});
            saveChatPrompts(once_history);
            saveGiveUpAttempt(true);
            saveCompletedMinutes(elapsedMinutes());
            saveSession();
            navigation.navigate('HomePage');
          }
        }}>
        <Text style = {count>1 ? styles.timerText : styles.exitText}>{'End the session'}</Text>
      </TouchableOpacity>
    </View>
    <View style = {{flex: 10}}>
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

    button: {
      backgroundColor: '#585858',
      height: '60%',
      width: '58%',
      borderRadius: 20,
      padding: 10,
      marginTop: 15,
      marginBottom: 15,
      borderColor: '#B8C59E',
    },

    exitButton: {
      backgroundColor: '#585858',
      height: '60%',
      width: '40%',
      borderRadius: 20,
      padding: 10,
      marginTop: 15,
      marginBottom: 15,
      borderColor: '#303030',
    },

    exitButtonPlus: {
      backgroundColor: '#585858',
      height: '60%',
      width: '40%',
      borderRadius: 20,
      padding: 10,
      marginTop: 15,
      marginBottom: 15,
      borderColor: '#B8C59E',
    },

    timerText: {
      top: '4%',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontFamily: 'Roboto',
      fontSize: 15,
      color: 'white',
      zIndex: 100,
    },

    exitText: {
      top: '4%',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontFamily: 'Roboto',
      fontSize: 15,
      color: '#817F7F',
      zIndex: 100,
    },

  });

export default ChatRefQuitPage;