import { Text, View, Button, LogBox } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';

function GPTchatbot(question, start_sentence) {
  return new Promise((resolve, reject) =>
  {
    const options = {
    	method: 'POST',
    	headers: {
    		'content-type': 'application/json',
    	},
    	body: JSON.stringify({"question":question,"start_chat_log":start_sentence})
    };

    const url = 'http://43.132.233.221:8080/chatbot';

    fetch(url, options)
      .then(response => response.json())
    	.then(response => resolve(response.answer))
    	.catch(err => reject(err));

  })}


export default GPTchatbot;