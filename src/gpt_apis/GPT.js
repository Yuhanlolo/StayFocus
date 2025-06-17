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

    const url = 'your-backend-with-gpt-api';

    fetch(url, options)
      .then(response => response.json())
    	.then(response => resolve(response.answer))
    	.catch(err => reject(err));

  })}


export default GPTchatbot;
