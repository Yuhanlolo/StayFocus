import { Text, View, Button, LogBox } from 'react-native';
import SentiAPI from './sentimentAnalysis';
import ParaAPI from './paraphraseTools';
import React, { useEffect, useReducer, useState } from 'react';

function usage() {
  const [tag, setTag] = useState("");
  const [sentence, setSentence] = useState("");
  const [answer, setAnswer] = useState("");
  useEffect(() => {
    (async () => {
      let tag = await SentiAPI('I am upset today.');
      console.log('look:', tag);
      setTag(tag);
    })()
  }, []);

  useEffect(() => {
    (async () => {
      let sentence = await ParaAPI('I am upset today.');
      console.log('look:', sentence);
      setSentence(sentence);
    })()
  }, []);

    useEffect(() => {
      (async () => {
        let answer = await chatAPI('I want to play games using my phone.', 'Why do you pick up your phone?');
        console.log('look:', answer);
        setAnswer(answer);
      })()
    }, []);
  return (
    <View><Text>{'OK'}</Text></View>
  );
}

export default usage;