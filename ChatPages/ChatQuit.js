import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import chatScript from '../ChatScripts/chatScript';
import ParaAPI from '../API/Para';

const chat_user = {
  _id: 1,
  name: 'user',
  avatar: "https://i.328888.xyz/2022/12/27/UyZwU.png",
}

const chatbot = {
  _id: 2,
  name: 'chatbot',
  avatar: "https://i.328888.xyz/2022/12/27/Uyixv.png",
}

global.flag = 'false';

function chatQuit() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      let sentence = await ParaAPI(chatScript.quit);
      let index = Math.round(Math.random() * 2);
      setMessages([
        {
          _id: 1,
          text: sentence[index],
          createdAt: new Date(),
          user: chatbot,
        },
      ])
    })()
  }, [])

  function botSend(txt)
  {
     if(flag == 'true')
     {
      console.log('in');
      let botMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: txt,
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
    botSend("I don't know what you mean.");
  }, [])

  const renderBubble = (props) =>
  {return(
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
          color: 'white',
        },
        right: {
          color: 'black',
        }
      }}
    />
  )}

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
      showAvatarForEveryMessage = {true}
      renderSend={renderSend}
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
    }

  });

export default chatQuit;