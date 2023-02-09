import { Text, View, Button, LogBox } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';

function SentiGPT(sentence) {
  return new Promise((resolve, reject) =>
  {
    const options = {
    	method: 'POST',
    	headers: {
    		'content-type': 'application/json',
    	},
    	body: JSON.stringify({"sentence":sentence})
    };

    const url = 'http://43.132.233.221:8081/senti';

    fetch(url, options)
      .then(response => response.json())
    	.then(response => resolve(response.sentiment))
    	.catch(err => reject(err));

  })}


export default SentiGPT;