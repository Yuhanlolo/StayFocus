import React, { Component, useState, useEffect} from 'react';
import { NativeModules, Text, View, Button} from 'react-native';


function App() {
  const [flag, setFlag] = useState('good');
  return(
  <View>
  <Button
    onPress={()=>{
    NativeModules.LockDetectionModule.getScreenStatus().then((map)=> {
        setFlag(map['flag']);
    }, (code, message)=> {})}}

    title="Press to see"
   />
  <Text>{'status: '}{flag}</Text>
  </View>
  );
}

export default App;