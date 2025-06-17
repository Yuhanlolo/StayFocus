import { Text, View, Button, LogBox } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';

function paraphrase(txt) {
  return new Promise((resolve, reject) =>
  {
    const options = {
    	method: 'POST',
    	headers: {
    		'content-type': 'application/json',
    		'X-RapidAPI-Key': 'your-api-key',
    		'X-RapidAPI-Host': 'paraphrase-genius.p.rapidapi.com'
    	},
    	body: JSON.stringify({"text":txt,"result_type":"multiple"})
    };

    const url = 'https://paraphrase-genius.p.rapidapi.com/dev/paraphrase/';

    fetch(url, options)
    	.then(response => response.json())
    	.then(response => resolve(response[0]))
    	.catch(err => reject(err));

  })}


export default paraphrase;
