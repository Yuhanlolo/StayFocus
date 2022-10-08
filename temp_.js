import React, { Component } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Picker,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		'X-RapidAPI-Key': 'bbfbb45401msh8e0769c39043966p148085jsn58f39432ddb8',
		'X-RapidAPI-Host': 'rewriter-paraphraser-text-changer-multi-language.p.rapidapi.com'
	},
	body: '{"language":"en","strength":3,"text":"Nice to meet u again! Hope to enjoy your focus time with me!"}'
};

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text_raw: "How are you doing? Are you going to be focused with me?",
        text: "Please look at me! ",
      };
      }



    getResponse = async ()=>
    {
        await fetch('https://rewriter-paraphraser-text-changer-multi-language.p.rapidapi.com/rewrite', options)
            .then((response) =>
            response.json())
            .then((res)=>{this.setState({text:JSON.stringify(res)});})
            .catch(err => console.error(err));
    }

     componentDidMount()
     {
       this.getResponse();
     }

    render() {
      return (
        <View style = {styles.background}>
          <Text style = {styles.baseText}>
            <Text>{this.state.text_raw}{'\n'}{this.state.text}</Text>
          </Text>
        </View>
      );
    }
}

  const styles = StyleSheet.create({

    background: {
     flex: 1,
     flexDirection: 'column',
     backgroundColor: '#8D9E98',
     alignItems: "center",
     justifyContent: "center",
     paddingHorizontal: 10
    },

    baseText: {
      fontSize: 9,
      position:'absolute',
      top:240,
      left:30,
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

  });


export default  App;